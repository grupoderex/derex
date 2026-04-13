const knexSingleton = require('../../lib/knex/knex.singleton.js');
const knex = knexSingleton.getKnexSingleton();

module.exports = {
  /**
   * @param {string} name 
   * @returns {promise} query
   */
  create: async (name) => {
    try {
      const [dataOut] = await knex('credit_type').insert({ name });
      return [201, dataOut];
    } catch (error) {
      console.error(`CatalogCreditType : Service.create (${name})`, error);
      return [401, error];
    }
  },

  /**
   * @param {number} id
   * @returns {promise} object
   */
  getById: async (id) => {
    try {
      const dataOut = await knex
        .select('id', 'name',)
        .from('credit_type')
        .where({ id })
        .first();

      return [200, dataOut];
    } catch (error) {
      console.error(`CatalogCreditType : Service.getById (${id})`, error);
      return [401, error];
    }
  },

  /**
   * @param {number} id
   * @param {string} name
   * @returns {promise} object
   */
  updateById: async (id, name) => {
    try {
      const dataOut = await knex('credit_type')
        .where({ id })
        .update({ name });

      return [201, dataOut];
    } catch (error) {
      console.error(`CatalogCreditType : Service.updateById (${id},${name})`, error);
      return [401, error];
    }
  },

  /**
   * @param {number} id
   * @returns {promise} object
   */
  deleteById: async (id) => {
    try {
      const dataOut = await knex('credit_type')
        .where({ id })
        .update({ active: false, });

      return [201, dataOut];
    } catch (error) {
      console.error(`CatalogCreditType : Service.deleteById (${id})`, error);
      return [401, error];
    }
  },

  /**
   * 
   * @param {number} id
   * @param {string} search
   * @param {number} page
   * @param {number} limit
   * @returns {promise} query
   */
  getByFilters: async (query) => {
    try {
      let { search, page, limit } = query;
      search = search || '';
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      const offset = (page * limit) - limit || 0;

      const dataOut = await knex
        .select('id', 'name')
        .from('credit_type')
        .where('active', 1)
        .andWhereILike('name', `%${search.replace(/ /g, '%')}%`)
        .offset(offset)
        .limit(limit)
        .orderBy('name', 'asc')
        ;

      const dataCount = await knex
        .count('* as total')
        .from('credit_type')
        .where('active', 1)
        .andWhereILike('name', `%${search.replace(/ /g, '%')}%`)
        ;

      return [200, {
        data: dataOut,
        page,
        limit,
        totalRegs: dataCount[0].total,
        totalPages: Math.ceil(dataCount[0].total / limit),
      }];
    } catch (error) {
      console.error(`CatalogCreditType : Service.getByFilters (${query})`, error);
      return [401, error];
    }
  },
};
