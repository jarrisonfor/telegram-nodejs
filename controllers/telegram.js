const TelegramBot = require("node-telegram-bot-api");
const db = require("./postgres");
const config = require("../config.json");

const tk = config.token;

const bot = new TelegramBot(tk, {
  polling: true
});

exports.telegrambot = () => {
  bot.onText(/\/tareas/, msg => {
    db.pg_mostrar_tareas()
      .then(datos => {
        if (datos.length === 0) {
          bot.sendMessage(msg.chat.id, "no hay tareas que realizar");
        } else {
          let tareas = ``;
          for (let i = 0; i < datos.length; i++) {
            tareas =
              tareas + datos[i].id + ". " + datos[i].descripcion + "\r\n";
          }
          bot.sendMessage(msg.chat.id, tareas);
        }
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(msg.chat.id, "error al obtener los datos");
      });
  });

  bot.onText(/\/n_tarea (.*)/, (msg, match) => {
    db.pg_insert_tareas(match[1])
      .then(done => {
        bot.sendMessage(msg.chat.id, "datos metidos");
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(msg.chat.id, "error al meter los datos");
      });
  });

  bot.onText(/\/b_tarea ([0-9]+)/, (msg, match) => {
    db.pg_borrar_tareas(match[1])
      .then(done => {
        bot.sendMessage(msg.chat.id, "tarea borrada");
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(msg.chat.id, "error al borrar la tarea");
      });
  });

  bot.onText(/\/yo/, msg => {
    bot.sendMessage(msg.chat.id, `tu chat id es: ${msg.chat.id}`);
  });
};
