const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
/**
 * @type {StateSql.StateService}
 */
const Estados = {
  // Obtener todos los estados
  getAll: () => knex.select("*").from("state"),

  // Obtener un estado por ID
  getById: (idEstado) =>
    knex.select("*").from("state").where("id", idEstado).first(),

  // Crear un nuevo estado
  create: async (createInput) => {
    const [id] = await knex("state").insert({
      ...createInput,
      update_at: knex.fn.now(),
    });
    return id;
  },

  // Actualizar un estado existente
  update: async (id, updateInput) =>
    knex("state").where("id", id).update(updateInput),

  // Eliminar un estado por ID
  delete: (idEstado) => knex("state").where("id", idEstado).del(),

  // Obtener todos los estados con sus ciudades por filtros
  getAllStatesCitiesFilters: async (filters) => {
    try {
      const { state_id, city_id } = filters;
      const where = {};
      where['s.active'] = 1;
      where['c.active'] = 1;

      if (state_id) where['s.id'] = state_id;
      if (city_id) where['c.id'] = city_id;

      const data = await knex
        .select(
          's.id as state_id',
          's.name as state_name',
          knex.raw(`json_arrayagg(json_object(
            'city_id', c.id,
            'city_name', c.name
          )) as cities`)
        )
        .from('state as s')
        .leftJoin('city as c', 'c.id_state', 's.id')
        .where(where)
        .groupBy('s.id', 's.name')
        ;

      for (const item of data) {
        item.cities = JSON.parse(item.cities);
      }

      return [200, data]
    } catch (error) {
      return [409, error];
    }
  },
};

module.exports = Estados;
