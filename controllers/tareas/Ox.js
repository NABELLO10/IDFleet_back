// Este es tu controlador, por ejemplo, sensorController.js
import Sensores from "../../models/Sensores.js";
import ResumenGPS from "../../models/ResumenGPS.js";
import Camiones from "../../models/Camiones.js";
import Token from "../../models/Token.js";
import cron from "node-cron";
import { exec } from "child_process"; // Asegúrate de importar exec si no lo has hecho
import TipoNotificacion from "../../models/TipoNotificacion.js";
import LogSensores from "../../models/LogSensores.js";
import { Op, where } from "sequelize";
import Sequelize from "sequelize";
import { promisify } from "util";
import moment from "moment";

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

  const wialonCamiones = await Camiones.findAll({
    where: {
      est_activo: 1,
      id_wialon: {
        [Sequelize.Op.gt]: 0, // Op.gt es el operador 'greater than' (mayor que)
      },
    },
  });

  const idWialonArray = wialonCamiones
    .filter((r) => r.est_ox == 1 || r.est_temp == 1)
    .reduce((accumulator, camion) => {
      // Verifica si el camión actual ya está en el acumulador basándose en idWi
      const yaExiste = accumulator.some(
        (item) =>
          item.idWi === camion.id_wialon &&
          item.idTra == camion.id_transportista
      );
      if (!yaExiste) {
        // Si no existe, lo agrega al acumulador
        accumulator.push({
          patente: camion.nom_patente,
          idWi: camion.id_wialon,
          idTra: camion.id_transportista,
          idEmp: camion.id_empresa,
          fecGPS: camion.fecGPS,
        });
      }
      return accumulator;
    }, []); // Inicia con un array vacío como acumulador

  //DATOS OX y TEMP
  if (idWialonArray.length > 0) {
    const unidadesStr = idWialonArray.map((obj) => obj.idWi).join(",");
    const scriptPath = join(__dirname, "datosOXCamiones.py");

    try {
      const resultado = await execAsync(
        `python ${scriptPath} ${token.token} ${unidadesStr}`
      );
      arraySensores = JSON.parse(resultado.stdout);
    } catch (error) {
      console.error(`exec error: ${error}`);
      return;
    }
   

    arraySensores.map(async (r) => {

      let valor13 = r.Valores[15] ? r.Valores[15].toString() : "";
      let valor14 = r.Valores[14] ? r.Valores[14].toString() : "";
      let valor15 = r.Valores[13] ? r.Valores[13].toString() : "";

      // Concatenar los valores con un separador específico, por ejemplo, un espacio
      let fechaConcatenada = [valor13, valor14, valor15]
        .filter((v) => v)
        .join(" ");

      const resultado = await Sensores.create({
        patente: r.Patente,
        fechaGPS: r.FechaGPS,
        id_wialon: r.idWialon,
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
        ox10: r.Valores[9],
        temp: r.Valores[10],
        ox11: r.Valores[11],
        ox12: r.Valores[12],
        fecha: fechaConcatenada, // Usamos la variable concatenada
        fec_gps: moment(r.FechaGPS).format("YYYY-MM-DD"),
      });

      const camionOX = await Camiones.findAll({
        where: { id_wialon: r.idWialon, est_activo: 1 },
      });

      const existeResumen = await ResumenGPS.findAll({
        where: {
          id_wialon: r.idWialon,
        },
      });

         if (existeResumen.length > 0) {
        await ResumenGPS.update(
          {
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
            ox10: r.Valores[9],
            temp: r.Valores[10],
            ox11: r.Valores[11],
            ox12: r.Valores[12],
            fecha: fechaConcatenada, 
            fechaRegistro: new Date(),
            est_ox: camionOX[0].dataValues.est_ox,
            est_temp: camionOX[0].dataValues.est_temp,
          },
          {
            where: {
              id_wialon: r.idWialon,
            },
          }
        );
      } else {
        await ResumenGPS.create({
          patente: r.Patente,
          id_wialon: r.idWialon,
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
          ox10: r.Valores[9],
          temp: r.Valores[10],
          ox11: r.Valores[11],
          ox12: r.Valores[12],
          fecha: fechaConcatenada, 
          fechaRegistro: new Date(),
          est_ox: camionOX[0].dataValues.est_ox,
          est_temp: camionOX[0].dataValues.est_temp,
        });
      }
    });

    idWialonArray.map(async (obj) => {
      const existeResumen = await ResumenGPS.findOne({
        where: {
          id_wialon: obj.idWi,
        },
      });

      if (existeResumen) {
        const data = {
          patente: obj.patente,
          idWialon: obj.idWi,
          fecGPS: existeResumen.fechaGPS,
          idEmpresa: obj.idEmp,
          idTransportista: obj.idTra,
          datosOX: existeResumen,
        };

        guardarLog(data);
      }
    });
  }
};

async function guardarLog(data) {
  const fueraRango = await checkOxigenation(data);

  if (Object.keys(fueraRango).length) {
    LogSensores.create({
      patente: data.patente.replace(/-/g, "").toUpperCase(),
      tipo: "Oxigenación GPS fuera de límites",
      detalle: JSON.stringify(fueraRango),
      fecha: new Date(),
      id_transportista: data.idTransportista,
      id_empresa: data.idEmpresa,
      fecGPS: data.datosOX.dataValues.fechaGPS,
      fecAlerta: moment(data.datosOX.dataValues.fechaGPS).format("YYYY-MM-DD"),
    });
  }

  async function checkOxigenation(data) {
    const tipoNotif = await TipoNotificacion.findOne({
      where: {
        id_cat_not: 1,
        id_empresa_sistema: data.idEmpresa,
        id_transportista: data.idTransportista,
      },
    });

    if (!tipoNotif) return {}; // Retorna un objeto vacío si no encuentra el tipo de notificación
    let fueraRango = {};

    // Extracción de valores "ox"
    let oxValues = [];
    for (let i = 1; i <= 10; i++) {
      const oxValue = data.datosOX.dataValues["ox" + i];

      if (oxValue !== undefined && !isNaN(parseFloat(oxValue))) {
        oxValues.push(parseFloat(oxValue));
      }
    }

    const valMin = parseFloat(tipoNotif.val_min);
    const valMax = parseFloat(tipoNotif.val_max);

    // Comparación de valores "ox"
    for (let i = 0; i < oxValues.length; i++) {
      let value = oxValues[i];

      if (value < valMin || value > valMax) {
        fueraRango["ox" + (i + 1)] = value;
      }
    }
    return fueraRango;
  }

  // temperatura
  const fueraRangotemp = await checkTemp(data);

  if (Object.keys(fueraRangotemp).length) {
    LogSensores.create({
      patente: data.patente.replace(/-/g, "").toUpperCase(),
      tipo: "Temperatura GPS fuera de límites",
      detalle: JSON.stringify(fueraRangotemp),
      fec_add: new Date(),
      id_transportista: data.idTransportista,
      id_empresa: data.idEmpresa,
      fecGPS: data.datosOX.dataValues.fechaGPS,
      fecAlerta: moment(data.datosOX.dataValues.fechaGPS).format("YYYY-MM-DD"),
    });
  }
}

async function checkTemp(data) {
  const tipoNotif = await TipoNotificacion.findOne({
    where: {
      id_cat_not: 2,
      id_empresa_sistema: data.idEmpresa,
      id_transportista: data.idTransportista,
    },
  });

  if (!tipoNotif) return {}; // Retorna un objeto vacío si no encuentra el tipo de notificación
  let fueraRango = {};

  const valMin = parseFloat(tipoNotif.val_min);
  const valMax = parseFloat(tipoNotif.val_max);

  if (
    data.datosOX.dataValues.temp < valMin ||
    data.datosOX.dataValues.temp > valMax
  ) {
    fueraRango["temp"] = data.datosOX.dataValues.temp;
  }

  return fueraRango;
}

// Programa la tarea para que se ejecute, por ejemplo, cada 3 minutos
cron.schedule("*/5 * * * *", () => {
  console.log("Tarea programada obtener OX siendo ejecutada...");
  registrarSensor();
});

/* 
  const idWialonArrayGral = wialonCamiones
    .filter((r) => r.est_ox == 0 && r.est_temp == 0)
    .map((camion) => camion.id_wialon);
 */

//DATOS GENERALES
/*   if (idWialonArrayGral.length > 0) {
    const unidadesStr = idWialonArrayGral.join(",");
    const scriptPath = join(__dirname, "datosGralCamiones.py");

    try {
      const resultado = await execAsync(
        `python ${scriptPath} ${token.token} ${unidadesStr}`
      );

      arraySensores = JSON.parse(resultado.stdout);
    } catch (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    arraySensores.map(async (r) => {
      await Sensores.create({
        patente: r.Patente,
        id_wialon: r.idWialon,
        fechaGPS: r.FechaGPS,
        latitud: r.Latitud,
        longitud: r.Longitud,
        curso: r.Curso,
        altitud: r.Altitud,
        fechaRegistro: new Date(),
        fec_gps: new Date().toISOString().split("T")[0],
      });

           
      const existeResumen = await ResumenGPS.findAll({
        where: {
          id_wialon: r.idWialon,
        },
      });

      if (existeResumen.length > 0) {
        await ResumenGPS.update(
          {
            patente: r.Patente,
            fechaGPS: r.FechaGPS,
            latitud: r.Latitud,
            longitud: r.Longitud,
            curso: r.Curso,
            altitud: r.Altitud,
            fechaRegistro: new Date(),
            est_ox : 0,
            est_temp : 0,
          },
          {
            where: {
              id_wialon: r.idWialon,
            },
          }
        );
      } else {
        await ResumenGPS.create({
          patente: r.Patente,
          id_wialon: r.idWialon,
          fechaGPS: r.FechaGPS,
          latitud: r.Latitud,
          longitud: r.Longitud,
          curso: r.Curso,
          altitud: r.Altitud,
          fechaRegistro: new Date(),
          est_ox : 0,
          est_temp : 0,
        });
      }
    });
  } */
