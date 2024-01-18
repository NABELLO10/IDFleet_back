// Este es tu controlador, por ejemplo, sensorController.js
import OxSchool from "../../models/OxSchool.js";
import cron from "node-cron";
import LogSensores from "../../models/LogSensores.js";


async function guardarLogTablet() { 
  const records = await OxSchool.findAll();

  records.forEach(async (record) => {
    // Revisa cada valor (O1 a O10)
    for (let i = 1; i <= 10; i++) {
      let valor = record[`O${i}`];
      if (valor > record.RA || valor < record.RB) {
        let patenteLimpia = record.PATENTE.replace(/[.-]/g, '');

        await LogSensores.create({
          patente: patenteLimpia,
          tipo: "Oxigenacion TABLET fuera de límites",
          detalle: `Sensor O${i} fuera de rango: ${valor}`,
          fecha: new Date(),
        });

        await OxSchool.update(
          {
            est_alerta: 1,
          },
          {
            where: {
              PATENTE: record.PATENTE
            },
          }
        );

      }
    }
  });
}

// Programa la tarea para que se ejecute, por ejemplo, cada 2 minutos
cron.schedule("*/2 * * * *", () => {
  console.log("Tarea programada obtener log tablet siendo ejecutada...");
  guardarLogTablet()
});
