const db = require("./controllers/postgres");
const tg = require("./controllers/telegram");
const cron = require("node-cron");
const axios = require("axios");
const config = require("./config.json");

tg.telegrambot();

cron.schedule("0 7 * * *", () => {
  db.pg_mostrar_tareas().then(datos => {
    if (datos.length === 0) {
      bot.sendMessage(msg.chat.id, "no hay tareas que realizar");
    } else {
      let tareas = ``;
      for (let i = 0; i < datos.length; i++) {
        tareas = tareas + datos[i].id + ". " + datos[i].descripcion + "\r\n";
      }
      axios
        .post(`https://api.telegram.org/bot${config.token}/sendMessage`, {
          chat_id: config.chatid,
          text: tareas
        })
        .then(response => {
          console.log("Mensaje autoenviado");
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
});
