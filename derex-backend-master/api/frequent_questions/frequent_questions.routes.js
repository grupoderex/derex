const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update } = require("./frequent_questions.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

/**
 * @type {FrequentQuestionsSql.CustomerExperienceService}
 */
const FrequentQuestionsDB = require("./frequent_questions.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const frequentsQuestion = await FrequentQuestionsDB.create(body);

      return res.json({
        data: frequentsQuestion,
        message: "Frequent Question creado.",
      });
    } catch (error) {
      console.error("Error al crear preguntas frecuentes:", error);
      return res
        .status(500)
        .json({ error: "Error al crear preguntas frecuentes." });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const frequentQuestionsList = await FrequentQuestionsDB.getAll();
    const data = frequentQuestionsList.map((frequentQuestion) => ({
      ...frequentQuestion,
      open_in_new_tab: Boolean(frequentQuestion.open_in_new_tab),
    }));
    return res.json({
      data,
      message: "Preguntas frecuentes obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener preguntas frecuentes:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener preguntas frecuentes" });
  }
});

router.get("/id/:id", async (req, res) => {
  const frequentQuestionId = parseInt(req.params.id);
  try {
    const frequentQuestion = await FrequentQuestionsDB.getById(
      frequentQuestionId
    );
    if (!frequentQuestion) {
      return res
        .status(404)
        .json({ error: "Pregunta frecuente no encontrada." });
    }
    const data = {
      ...frequentQuestion,
      open_in_new_tab: Boolean(frequentQuestion.open_in_new_tab),
    };

    return res.json({
      status: 200,
      data,
    });
  } catch (error) {
    console.error("Error al obtener preguntas frecuente:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener preguntas frecuentes por ID." });
  }
});

router.patch(
  "/id/:id",
  checkSchema(update),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const frequentQuestionId = parseInt(req.params.id);
    try {
      const body = req.body;
      const frequentQuestion = await FrequentQuestionsDB.update(
        frequentQuestionId,
        body
      );

      return res.json({
        data: frequentQuestion,
        message: "Pregunta frecuente actualizada.",
      });
    } catch (error) {
      console.error("Error al actualizar pregunta frecuente:", error);
      return res
        .status(500)
        .json({ error: "Error al actualizar pregunta frecuente" });
    }
  }
);

router.delete("/id/:id", getAdminSession, async (req, res) => {
  const frequentQuestionId = parseInt(req.params.id);
  try {
    const result = await FrequentQuestionsDB.delete(frequentQuestionId);

    return res.json({
      data: result,
      message: "Pregunta frecuente eliminada.",
    });
  } catch (error) {
    console.error("Error al eliminar pregunta frecuente:", error);
    return res
      .status(500)
      .json({ error: "Error al eliminar pregunta frecuente" });
  }
});

module.exports = router;
