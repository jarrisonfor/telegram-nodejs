const pgp = require("pg-promise")();
const config = require('../config.json');
const db = pgp(config.postgres);

let query = `
CREATE TABLE IF NOT EXISTS public.tareas (
    id bigserial not null,
    descripcion varchar(255) not null,
    constraint tareas_pk primary key (id)
);`;
db.none(query)
  .then(done => {
    console.log("funcionando con normalidad");
  })
  .catch(err => {
    console.log(err);
  });

exports.pg_insert_tareas = async descripcion => {
  return new Promise(async (resolve, reject) => {
    let query = `INSERT INTO public.tareas(descripcion) VALUES ('${descripcion}');`;
    db.none(query)
      .then(() => {
        resolve("done");
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.pg_mostrar_tareas = async () => {
  return new Promise(async (resolve, reject) => {
    let query = "select * from tareas";
    db.query(query)
      .then(datos => {
        resolve(datos);
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.pg_borrar_tareas = async id => {
  return new Promise(async (resolve, reject) => {
    let query = `delete from tareas where id = ${id}`;
    db.none(query)
      .then(() => {
        resolve("done");
      })
      .catch(err => {
        reject(err);
      });
  });
};
