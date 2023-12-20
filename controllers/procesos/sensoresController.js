// Este es tu controlador, por ejemplo, sensorController.js
import Sensores from "../../models/Sensores.js";
import ResumenGPS from "../../models/ResumenGPS.js";
import Token from "../../models/Token.js";
import cron from "node-cron";
import { exec } from "child_process"; // Asegúrate de importar exec si no lo has hecho
import TipoNotificacion from "../../models/TipoNotificacion.js";
import LogSensores from "../../models/LogSensores.js";

import { promisify } from "util";

import { fileURLToPath } from "url";
import { dirname, join } from "path"; //

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let arraySensores = [];

// Esta es la tarea que deseas programar
const registrarSensor = async () => {
  const token = await Token.findOne({
    attributes: ["token"],
    where: {
      id: 1,
    },
  });
  const scriptPath = join(__dirname, "Datos_ox.py"); // <-- Corregido aquí

  try {
    const resultado = await execAsync(`python ${scriptPath} ${token.token}`);
    arraySensores = JSON.parse(resultado.stdout);
  } catch (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  arraySensores.map(async (r) => {
    const resultado = await Sensores.create({
      patente: r.Patente,
      fechaGPS: r.FechaGPS,
      latitud: r.Latitud,
      longitud: r.Longitud,
      curso: r.Curso,
      altitud: r.Altitud,
      ox1: r.Valores[0],
      ox2: r.Valores[1],
      ox3: r.Valores[2],
      ox4: r.Valores[3],
      ox5: r.Valores[4],
      ox6: r.Valores[5],
      ox7: r.Valores[6],
      ox8: r.Valores[7],
      ox9: r.Valores[8],
      temp: r.Valores[9],
      fecha: r.Valores[10],
      time: r.Valores[11],
    });
    guardarLog(resultado);

    const existeResumen = await ResumenGPS.findAll({
      where: {
        patente: r.Patente,
      },
    });


    if (existeResumen.length > 0) {
        
      await ResumenGPS.update(
        {
          fechaGPS: r.FechaGPS,
          latitud: r.Latitud,
          longitud: r.Longitud,
          curso: r.Curso,
          altitud: r.Altitud,
          ox1: r.Valores[0],
          ox2: r.Valores[1],
          ox3: r.Valores[2],
          ox4: r.Valores[3],
          ox5: r.Valores[4],
          ox6: r.Valores[5],
          ox7: r.Valores[6],
          ox8: r.Valores[7],
          ox9: r.Valores[8],
          temp: r.Valores[9],
          fecha: r.Valores[10],
          time: r.Valores[11],
          fechaRegistro: new Date(),
        },
        {
          where: {
            patente: r.Patente,
          },
        }
      );
    } else {
  
      await ResumenGPS.create({
        patente: r.Patente,
        fechaGPS: r.FechaGPS,
        latitud: r.Latitud,
        longitud: r.Longitud,
        curso: r.Curso,
        altitud: r.Altitud,
        ox1: r.Valores[0],
        ox2: r.Valores[1],
        ox3: r.Valores[2],
        ox4: r.Valores[3],
        ox5: r.Valores[4],
        ox6: r.Valores[5],
        ox7: r.Valores[6],
        ox8: r.Valores[7],
        ox9: r.Valores[8],
        temp: r.Valores[9],
        fecha: r.Valores[10],
        time: r.Valores[11],
        fechaRegistro: new Date(),
      });
    }
  });
};

async function guardarLog(data) {
  const fueraRango = await checkOxigenation(data);

  if (Object.keys(fueraRango).length) {
    // Guarda en la tabla de logs
    LogSensores.create({
      patente: data.patente,
      tipo: "Oxigenación fuera de límites",
      detalle: JSON.stringify(fueraRango),
      fecha: new Date(),
    });
  }

  const fueraRangotemp = await checkTemp(data);

  if (Object.keys(fueraRangotemp).length) {
    // Guarda en la tabla de logs
    LogSensores.create({
      patente: data.patente,
      tipo: "Temperatura fuera de límites",
      detalle: JSON.stringify(fueraRango),
      fecha: new Date(),
    });
  }
}

async function checkOxigenation(data) {
  const tipoNotif = await TipoNotificacion.findOne({
    where: { id_cat_not: 1, id_empresa: 1 },
  });

  if (!tipoNotif) return {}; // Retorna un objeto vacío si no encuentra el tipo de notificación
  let fueraRango = {};

  // Extracción de valores "ox"
  let oxValues = [];
  for (let i = 1; i <= 10; i++) {
    oxValues.push(parseFloat(data["ox" + i]));
  }

  // Comparación de valores "ox"
  for (let i = 0; i < oxValues.length; i++) {
    let value = oxValues[i];

    if (
      value < parseFloat(tipoNotif.val_min) ||
      value > parseFloat(tipoNotif.val_max)
    ) {
      fueraRango["ox" + (i + 1)] = value;
    }
  }
  return fueraRango;
}

async function checkTemp(data) {
  const tipoNotif = await TipoNotificacion.findOne({
    where: { id_cat_not: 2, id_empresa: 1 },
  });

  if (!tipoNotif) return {}; // Retorna un objeto vacío si no encuentra el tipo de notificación
  let fueraRango = {};

    if (
      data.temp < parseFloat(tipoNotif.val_min) ||
      data.temp > parseFloat(tipoNotif.val_max)
    ) {
      fueraRango["temp"] = data.temp;
    }

  return fueraRango;
}

// Programa la tarea para que se ejecute, por ejemplo, cada minuto
cron.schedule("*/5 * * * *", () => {
  console.log("Tarea programada siendo ejecutada...");
  registrarSensor();
});
