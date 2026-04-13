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
const section = sections.home;

router.get("/", async (req, res) => {
  try {
    const meta = await Meta.getBySection(section);
    const data = meta.map((item) => ({
      ...item,
      bold: item.bold === 1 ? true : false,
      outline: item.outline === 1 ? true : false,
      color: item.color === 1 ? true : false,
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
    res.json({
      status: "success",
      data: meta,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
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
});

router.put(
  "/:id",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    data.section = section.home;
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
