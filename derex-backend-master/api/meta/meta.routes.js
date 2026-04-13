const express = require("express");
const { checkSchema } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

const router = express.Router();
const Meta = require("./meta.sql");
const { upsert, upsertMany } = require("./meta.schema");

router.post(
  "/",
  checkSchema(upsert),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const data = req.body;
    try {
      const meta = await Meta.upsert(data);
      res.json({
        status: "success",
        data: meta,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/create-or-update-many",
  checkSchema(upsertMany),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const body = req.body;
    const data = body.data;
    try {
      const meta = await Meta.upsertMany(data);
      res.json({
        status: "success",
        data: meta,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/:section", async (req, res) => {
  try {
    const section = req.params.section;
    const meta = await Meta.getBySection(section);
    const data = meta.map((meta) => ({
      ...meta,
      bold: Boolean(meta.bold),
      outline: Boolean(meta.outline),
      color: Boolean(meta.color),
    }));
    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-many", getAdminSession, async (req, res) => {
  const body = req.body;
  const ids = body.ids;
  try {
    const meta = await Meta.deleteMany(ids);
    res.json({
      status: "success",
      data: meta,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
