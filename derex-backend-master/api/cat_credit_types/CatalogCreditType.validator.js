const { body, param, query, } = require('express-validator');

module.exports = {
  create: [
    body('name').isString().withMessage('Name is required'),
  ],

  getById: [
    param('id').isInt().withMessage('ID is required'),
  ],

  updateById: [
    param('id').isInt().withMessage('ID is required'),
    body('name').isString().withMessage('Name is required'),
  ],

  deleteById: [
    param('id').isInt().withMessage('ID is required'),
  ],

  getByFilters: [
    query('id').optional({ checkFalsy: true }).isInt(),
    query('search').optional({ checkFalsy: true }).isString(),
    query('page').optional({ checkFalsy: true }).isInt(),
    query('limit').optional({ checkFalsy: true }).isInt(),
  ],
};
