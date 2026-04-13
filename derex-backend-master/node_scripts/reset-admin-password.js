const bcrypt = require("bcryptjs");
const knexSingleton = require("../lib/knex/knex.singleton");
const { generateSHA256 } = require("../utils/encryption");

async function run () {
  const emailArg = process.argv[2];
  const passwordArg = process.argv[3];

  if (!emailArg || !passwordArg) {
    console.error(
      "Uso: node node_scripts/reset-admin-password.js <email> <newPassword>"
    );
    process.exit(1);
  }

  const email = emailArg.toLowerCase().trim();
  const newPassword = passwordArg.trim();

  if (newPassword.length < 8) {
    console.error("La nueva contrasena debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const knex = knexSingleton.getKnexSingleton();

  try {
    const admin = await knex("admin").select("id", "email").where({ email }).first();

    if (!admin) {
      console.error(`No existe un admin con email: ${email}`);
      process.exit(1);
    }

    const shaPassword = generateSHA256(newPassword);
    const hashedPassword = await bcrypt.hash(shaPassword, 10);

    await knex("admin")
      .where({ id: admin.id })
      .update({ hashed_password: hashedPassword });

    console.log(`Contrasena actualizada correctamente para: ${admin.email}`);
  } catch (error) {
    console.error("Error al resetear contrasena de admin:", error.message);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

run();