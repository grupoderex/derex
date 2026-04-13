const Service = require('./CatalogCreditType.service.js');

module.exports = {
  create: async (req, res) => {
    try {
      const [status, data] = await Service.create(req.body.name);
      return res.status(status).json({ data });
    } catch (error) {
      console.error('CatalogCreditType : Controller.create ()', error);
      return res.status(409).json(error);
    }
  },

  getById: async (req, res) => {
    try {
      const [status, data] = await Service.getById(req.params.id);
      return res.status(status).json({ data });
    } catch (error) {
      console.error('CatalogCreditType : Controller.getById ()', error);
      return res.status(409).json(error);
    }
  },

  updateById: async (req, res) => {
    try {
      const [status, data] = await Service.updateById(req.params.id, req.body.name);
      return res.status(status).json({ data });
    } catch (error) {
      console.error('CatalogCreditType : Controller.updateById ()', error);
      return res.status(409).json(error);
    }
  },

  deleteById: async (req, res) => {
    try {
      const [status, data] = await Service.deleteById(req.params.id);
      return res.status(status).json({ data });
    } catch (error) {
      console.error('CatalogCreditType : Controller.deleteById ()', error);
      return res.status(409).json(error);
    }
  },

  getByFilters: async (req, res) => {
    try {
      const [status, data] = await Service.getByFilters(req.query);
      return res.status(status).json({ data });
    } catch (error) {
      console.error('CatalogCreditType : Controller.getByFilters ()', error);
      return res.status(409).json(error);
    }
  },
};