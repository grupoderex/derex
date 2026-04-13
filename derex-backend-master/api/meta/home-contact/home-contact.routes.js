const express = require("express");
const { checkSchema } = require("express-validator");
const {
  validationMiddleware,
  getAdminSession,
} = require("../../../middlewares");

const router = express.Router();
const Meta = require("../meta.sql");
const create = require("../meta.schema");
const { sections } = require("../models/meta.models");
const section = sections.homeContact;

router.get("/", async (req, res) => {
  try {
    const meta = await Meta.getBySection(section);
    const data = meta.map((item) => ({
      ...item,
      bold: Boolean(item.bold),
      outline: Boolean(item.outline),
      color: Boolean(item.color),
    }));

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const meta = await Meta.getById(id);
    if (!meta) {
      res.status(404).json({ error: "Meta not found" });
    }
    const data = {
      ...meta,
      bold: Boolean(meta.bold),
      outline: Boolean(meta.outline),
      color: Boolean(meta.color),
    };
    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  async (req, res) => {
    const data = req.body;
    data.section = section;
    try {
      const meta = await Meta.create(data);
      res.json({
        status: "success",
        data: meta,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    data.section = section;
    try {
      const meta = await Meta.update(id, data);
      res.json({
        status: "success",
        data: meta,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
