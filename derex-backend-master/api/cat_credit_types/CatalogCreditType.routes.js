const express = require("express");
const router = express.Router();
const { create, getById, updateById, deleteById, getByFilters, } = require('./CatalogCreditType.validator.js');
const { validationMiddleware, getAdminSession } = require('../../middlewares');
const Ctrl = require('./CatalogCreditType.ctrl.js');

module.exports = router
  .get('/get-by-id/:id', getById, validationMiddleware, Ctrl.getById)
  .get('/get-by-filters', getByFilters, validationMiddleware, Ctrl.getByFilters)
  .use('/', getAdminSession)
  .post('/create', create, validationMiddleware, Ctrl.create)
  .patch('/update-by-id/:id', updateById, validationMiddleware, Ctrl.updateById)
  .delete('/delete-by-id/:id', deleteById, validationMiddleware, Ctrl.deleteById)
  ;
