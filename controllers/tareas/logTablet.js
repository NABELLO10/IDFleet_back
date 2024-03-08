import ResumenTablet from "../../models/ResumenTablet.js";
import cron from "node-cron";
import LogSensores from "../../models/LogSensores.js";
//import emailNotificaciones from "../../helpers/emailNotificaciones.js";
import moment from 'moment-timezone';

const fechaChile = moment.tz(new Date(), 'America/Santiago').format('YYYY-MM-DD HH:mm:ss');

/* async function guardarLogTablet() { 
  const records = await ResumenTablet.findAll();

  records.forEach(async (record) => {

    // Revisa cada valor (O1 a O10)
    for (let i = 1; i <= 10; i++) {
      let valor = record[`O${i}`];

      if (valor > record.RA || valor < record.RB) {

        let patenteLimpia = record.PATENTE.replace(/[.-]/g, '');

        const resultado = await LogSensores.create({
          patente: patenteLimpia,
          tipo: "Oxigenación TABLET fuera de límites",
          detalle: `Sensor O${i} fuera de rango: ${valor}`,
          fecha: fechaChile,
          fechaRegistro : new Date().toISOString().split('T')[0],
          fecGPS : record.DATE + " " + record.TIME,
          fecAlerta : record.DATE,
        });

         emailNotificaciones({
          des : resultado.detalle,
          fecha : fechaChile,
          tipo_alerta: "OXIGENACIÓN",
          cat_alerta : 0,
          patente : record.PATENTE,
          origen: "Tablet"
        })  
               
        await ResumenTablet.update(
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
} */

async function guardarLogTablet() { 
  const records = await ResumenTablet.findAll();

  records.forEach(async (record) => {
    let detallesFueraDeRango = {};

    // Revisa cada valor (O1 a O10)
    for (let i = 1; i <= 10; i++) {
      let valor = record[`O${i}`];

      if (valor > record.RA || valor < record.RB) {
        detallesFueraDeRango[`ox${i}`] = valor;        
        // ...resto del código para actualizar el registro y enviar notificaciones
      }
    }

    // Si hay detalles fuera de rango, crea el log
    if (Object.keys(detallesFueraDeRango).length > 0) {
      let patenteLimpia = record.PATENTE.replace(/[.-]/g, '');
      const jsonDetalle = JSON.stringify(detallesFueraDeRango);

       await LogSensores.create({
        patente: patenteLimpia,
        tipo: "Oxigenación TABLET fuera de límites",
        detalle: jsonDetalle,
        fecha: fechaChile,
        fechaRegistro: new Date().toISOString().split('T')[0],
        fecGPS: record.DATE + " " + record.TIME,
        fecAlerta: record.DATE,
      });

      // ...resto del código para enviar notificaciones y actualizar el estado de alerta
    }
  });
}


// Programa la tarea para que se ejecute, por ejemplo, cada 2 minutos
cron.schedule("*/5 * * * *", () => {
  console.log("Tarea programada  LOG TABLET siendo ejecutada...");
  guardarLogTablet()
});
