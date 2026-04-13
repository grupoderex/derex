START TRANSACTION;

-- Paso 1: Agregar la columna
ALTER TABLE javer_db.project_property_blueprints
    ADD COLUMN orden INT NOT NULL DEFAULT 0 AFTER id_property;

-- Paso 2: Asignar valores incrementales por id_property
SET @prev_property := NULL;
SET @orden := 0;

UPDATE javer_db.project_property_blueprints
    JOIN (SELECT id,
                 IF(@prev_property = id_property, @orden := @orden + 1, @orden := 1) AS nuevo_orden,
                 @prev_property := id_property
          FROM javer_db.project_property_blueprints
          ORDER BY id_property, id) AS orden_sub ON javer_db.project_property_blueprints.id = orden_sub.id
SET javer_db.project_property_blueprints.orden = orden_sub.nuevo_orden
WHERE javer_db.project_property_blueprints.id_property != 0;

COMMIT;