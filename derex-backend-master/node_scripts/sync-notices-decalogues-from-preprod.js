const mysql = require('mysql2/promise');

const BASE = 'https://preprod-api.javer.com.mx';
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '@Tecmilenio2025',
  database: 'javer_db',
  charset: 'utf8mb4',
};

async function getJson (url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return res.json();
}

function asInt (v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function nullIfEmpty (v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string' && v.trim() === '') return null;
  return v;
}

(async () => {
  const conn = await mysql.createConnection(dbConfig);
  try {
    await conn.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');

    const [noticeSections, decalogueSections, homeMeta] = await Promise.all([
      getJson(`${BASE}/section-decalogue/type/notice`),
      getJson(`${BASE}/section-decalogue/type/decalogue`),
      getJson(`${BASE}/meta/home`),
    ]);

    const sections = [
      ...(noticeSections?.data || []).map((s) => ({ ...s, type: 'notice' })),
      ...(decalogueSections?.data || []).map((s) => ({ ...s, type: 'decalogue' })),
    ];

    for (const s of sections) {
      const sid = asInt(s.id);
      if (!sid) continue;
      await conn.query(
        `INSERT INTO section_decalogue (id, type, name_es, name_en)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           type = VALUES(type),
           name_es = VALUES(name_es),
           name_en = VALUES(name_en)`,
        [sid, s.type || 'decalogue', s.name_es || '', s.name_en || '']
      );
    }

    const ids = new Set();
    for (const s of sections) {
      for (const d of s.decalogue || []) {
        const did = asInt(d.id);
        if (did) ids.add(did);
      }
    }

    const details = await Promise.all(
      [...ids].map((id) => getJson(`${BASE}/decalogue/id/${id}`).catch(() => null))
    );

    for (const payload of details) {
      const d = payload?.data;
      if (!d) continue;
      const did = asInt(d.id);
      const sectionId = asInt(d.section_id);
      if (!did || !sectionId) continue;

      await conn.query(
        `INSERT INTO decalogue (id, title_es, title_en, content, content_date, file, section_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title_es = VALUES(title_es),
           title_en = VALUES(title_en),
           content = VALUES(content),
           content_date = VALUES(content_date),
           file = VALUES(file),
           section_id = VALUES(section_id)`,
        [
          did,
          d.title_es || '',
          d.title_en || '',
          nullIfEmpty(d.content),
          nullIfEmpty(d.content_date),
          nullIfEmpty(d.file),
          sectionId,
        ]
      );
    }

    const homeMetaMap = new Map((homeMeta?.data || []).map((m) => [m.name, m]));
    const metaKeys = ['others_privacyNotice', 'others_decalogues'];
    for (const key of metaKeys) {
      const m = homeMetaMap.get(key);
      if (!m) continue;
      await conn.query(
        `INSERT INTO meta (section, name, value, value_en, bold, outline, color)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           value = VALUES(value),
           value_en = VALUES(value_en),
           bold = VALUES(bold),
           outline = VALUES(outline),
           color = VALUES(color)`,
        [
          'home',
          key,
          m.value ?? '',
          m.value_en ?? null,
          m.bold ? 1 : 0,
          m.outline ? 1 : 0,
          m.color ? 1 : 0,
        ]
      );
    }

    const [[secCount]] = await conn.query(
      "SELECT COUNT(*) AS c FROM section_decalogue WHERE type IN ('notice','decalogue')"
    );
    const [[decCount]] = await conn.query(
      "SELECT COUNT(*) AS c FROM decalogue WHERE section_id IN (SELECT id FROM section_decalogue WHERE type IN ('notice','decalogue'))"
    );
    const [metaRows] = await conn.query(
      "SELECT section,name,value,value_en,bold,outline,color FROM meta WHERE section='home' AND name IN ('others_privacyNotice','others_decalogues') ORDER BY name"
    );

    console.log('Synced sections:', sections.length);
    console.log('Synced decalogue details:', details.filter((x) => x?.data).length);
    console.log('DB section_decalogue count (notice/decalogue):', secCount.c);
    console.log('DB decalogue count (linked):', decCount.c);
    console.log('Meta rows:', JSON.stringify(metaRows, null, 2));
  } finally {
    await conn.end();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
