/**
 * Repara mojibake en project_promotions.title_es y description_es.
 *
 * Causa: los bytes UTF-8 de caracteres españoles (ej. Ó = C3 93) fueron
 * interpretados como CP437 y almacenados como Unicode, resultando en
 * secuencias como ├ô en lugar de Ó.
 *
 * Fix: por cada string, encode los caracteres de vuelta a bytes CP437,
 * luego decodifica esos bytes como UTF-8 para recuperar el texto original.
 */

const mysql = require("mysql2/promise");

// Tabla CP850 byte → Unicode codepoint (rango 0x80–0xFF)
// HEX analisis confirmó CP850: é (C3 A9) → ├® donde ® = U+00AE = CP850 byte 0xA9
const CP850 = [
  0xc7, 0xfc, 0xe9, 0xe2, 0xe4, 0xe0, 0xe5, 0xe7, 0xea, 0xeb, 0xe8, 0xef,
  0xee, 0xec, 0xc4, 0xc5, // 0x80-0x8F
  0xc9, 0xe6, 0xc6, 0xf4, 0xf6, 0xf2, 0xfb, 0xf9, 0xff, 0xd6, 0xdc, 0xf8,
  0xa3, 0xd8, 0xd7, 0x192, // 0x90-0x9F
  0xe1, 0xed, 0xf3, 0xfa, 0xf1, 0xd1, 0xaa, 0xba, 0xbf, 0xae, 0xac, 0xbd,
  0xbc, 0xa1, 0xab, 0xbb, // 0xA0-0xAF  (0xA9=® diferencia clave vs CP437)
  0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0xc1, 0xc2, 0xc0, 0xa9,
  0x2563, 0x2551, 0x2557, 0x255d, 0xa2, 0xa5, 0x2510, // 0xB0-0xBF
  0x2514, 0x2534, 0x252c, 0x251c, 0x2500, 0x253c, 0xe3, 0xc3, 0x255a,
  0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256c, 0xa4, // 0xC0-0xCF
  0xf0, 0xd0, 0xca, 0xcb, 0xc8, 0x131, 0xcd, 0xce, 0xcf,
  0x2518, 0x250c, 0x2588, 0x2584, 0xa6, 0xcc, 0x2580, // 0xD0-0xDF
  0xd3, 0xdf, 0xd4, 0xd2, 0xf5, 0xd5, 0xb5, 0xfe, 0xde, 0xda, 0xdb, 0xd9,
  0xfd, 0xdd, 0xaf, 0xb4, // 0xE0-0xEF
  0xad, 0xb1, 0x2017, 0xbe, 0xb6, 0xa7, 0xf7, 0xb8, 0xb0, 0xa8, 0xb7, 0xb9,
  0xb3, 0xb2, 0x25a0, 0xa0, // 0xF0-0xFF
];

// Mapa inverso: codepoint Unicode → byte CP850
const unicodeToCp437 = new Map();
for (let i = 0; i < CP850.length; i++) {
  unicodeToCp437.set(CP850[i], i + 0x80);
}
// ASCII 0x00–0x7F se mapean 1:1
for (let i = 0; i < 0x80; i++) {
  unicodeToCp437.set(i, i);
}

/**
 * Intenta reparar un string con mojibake CP850→UTF-8.
 * Solo actúa si el string contiene caracteres indicadores de corrupción
 * (├ U+251C o ┬ U+252C, que provienen de bytes C3/C2 en CP850 reinterpretados
 * como Unicode). Si el resultado tiene caracteres inválidos (U+FFFD), aborta.
 */
function fixMojibake(str) {
  if (!str) return str;
  // Solo procesamos si hay indicadores claros de mojibake CP850
  if (!str.includes("\u251C") && !str.includes("\u252C")) return str;
  try {
    const bytes = [];
    for (const ch of str) {
      const cp = ch.codePointAt(0);
      const byte = unicodeToCp437.get(cp);
      if (byte === undefined) return str; // carácter sin representación CP850 → no tocar
      bytes.push(byte);
    }
    const buf = Buffer.from(bytes);
    const decoded = buf.toString("utf8");
    // Si la decodificación produce caracteres de reemplazo, la cadena no era mojibake
    if (decoded.includes("\uFFFD")) return str;
    if (decoded === str) return str;
    return decoded;
  } catch {
    return str;
  }
}

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Tecmilenio2025",
    database: "javer_db",
    charset: "utf8mb4",
  });

  const [rows] = await conn.execute(
    "SELECT id, title_es, description_es FROM project_promotions"
  );

  let fixed = 0;
  for (const row of rows) {
    const newTitle = fixMojibake(row.title_es);
    const newDesc = fixMojibake(row.description_es);

    if (newTitle !== row.title_es || newDesc !== row.description_es) {
      await conn.execute(
        "UPDATE project_promotions SET title_es = ?, description_es = ? WHERE id = ?",
        [newTitle, newDesc, row.id]
      );
      console.log(`[${row.id}] "${row.title_es}" → "${newTitle}"`);
      fixed++;
    }
  }

  console.log(`\nListo. ${fixed} filas reparadas de ${rows.length} totales.`);
  await conn.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
