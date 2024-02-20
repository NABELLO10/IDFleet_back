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


  // Transformar el resultado en un array de valores de id_wialon
  const idWialonArray = wialonCamiones
    .filter((r) => r.est_ox == 1 || r.est_temp == 1 )
    .map((camion) => camion.id_wialon);


  const idWialonArrayGral = wialonCamiones
    .filter((r) => r.est_ox == 0 && r.est_temp == 0)
    .map((camion) => camion.id_wialon);


//DATOS GENERALES
  if (idWialonArrayGral.length > 0) {
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
    }+

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
        });
      }
    });
  }

//DATOS OX y TEMP
  if (idWialonArray.length > 0) {
    const unidadesStr = idWialonArray.join(",");
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
        temp: r.Valores[9],
        fecha: r.Valores[10],
        time: r.Valores[11],
        fec_gps: new Date().toISOString().split("T")[0],
      });

      const camionOX = await Camiones.findAll({          
        where: { id_wialon : r.idWialon },          
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
            temp: r.Valores[9],
            fecha: r.Valores[10],
            time: r.Valores[11],
            fechaRegistro: new Date(),
            est_ox : camionOX[0].dataValues.est_ox,
            est_temp : camionOX[0].dataValues.est_temp,
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
          temp: r.Valores[9],
          fecha: r.Valores[10],
          time: r.Valores[11],
          fechaRegistro: new Date(),
          est_ox : camionOX[0].dataValues.est_ox,
          est_temp : camionOX[0].dataValues.est_temp,
        });
      }
      guardarLog(resultado);

    });
  } 
};

 async function guardarLog(data) {
  const empresaUnidad = await Camiones.findAll({
    attributes: ["id_empresa", "id_transportista"],
     where: {
      nom_patente: data.patente
    }, 
  });

  // Obteniendo el id_empresa e id_transportista
  const idEmpresa = empresaUnidad.map((unidad) => unidad.id_empresa);
  const idTransportista = empresaUnidad.map((unidad) => unidad.id_transportista);
  
  const fueraRango = await checkOxigenation(data, idEmpresa, idTransportista);

  if (Object.keys(fueraRango).length) {
    // Guarda en la tabla de logs
    idTransportista.map(transportista => {
      LogSensores.create({
        patente: data.patente,
        tipo: "Oxigenación GPS fuera de límites",
        detalle: JSON.stringify(fueraRango),
        fecha: new Date(),
        id_transportista : transportista,
        fechaRegistro : new Date().toISOString().split('T')[0],
      });
    })

    await ResumenGPS.update(
      {
        est_alerta_ox: 1,
      },
      {
        where: {
          id_wialon: data.id_wialon,
        },
      }
    );
  }else{
    await ResumenGPS.update(
        {
          est_alerta_ox: 0,
        },
        {
          where: {
            id_wialon: data.id_wialon,
          },
        }
      );
  }


  const fueraRangotemp = await checkTemp(data, idEmpresa, idTransportista);

  if (Object.keys(fueraRangotemp).length) {
    // Guarda en la tabla de logs
    idTransportista.map(transportista => {
      LogSensores.create({
        patente: data.patente,
        tipo: "Temperatura GPS fuera de límites",
        detalle: JSON.stringify(fueraRango),
        fecha: new Date(),
        id_transportista : transportista
      });
    })

    await ResumenGPS.update(
      {
        est_alerta_temp: 1,
      },
      {
        where: {
          id_wialon: data.id_wialon,
        },
      }
    );
  }else{
    await ResumenGPS.update(
        {
          est_alerta_temp: 0,
        },
        {
          where: {
            id_wialon: data.id_wialon,
          },
        }
      );
    }  
} 

async function checkOxigenation(data, empresaUnidad, idTransportista) {
  const tipoNotif = await TipoNotificacion.findOne({
    where: { id_cat_not: 1, id_empresa_sistema: empresaUnidad, id_transportista : idTransportista },
  });

  if (!tipoNotif) return {}; // Retorna un objeto vacío si no encuentra el tipo de notificación
  let fueraRango = {};

  // Extracción de valores "ox"
  let oxValues = [];
  for (let i = 1; i <= 10; i++) {
    oxValues.push(parseFloat(data["ox" + i]));
  }

  const valMin = parseFloat(tipoNotif.val_min)
  const valMax =  parseFloat(tipoNotif.val_max)

  // Comparación de valores "ox"
  for (let i = 0; i < oxValues.length; i++) {
    let value = oxValues[i];

    if (
      value < valMin ||
      value > valMax
    ) {
      fueraRango["ox" + (i + 1)] = value;
    }
  }
  return fueraRango;
}


async function checkTemp(data, empresaUnidad, idTransportista) {
  const tipoNotif = await TipoNotificacion.findOne({
    where: { id_cat_not: 2, id_empresa_sistema: empresaUnidad, id_transportista : idTransportista },
  });
 
  if (!tipoNotif) return {}; // Retorna un objeto vacío si no encuentra el tipo de notificación
  let fueraRango = {};

  const valMin = parseFloat(tipoNotif.val_min)
  const valMax =  parseFloat(tipoNotif.val_max)

  if (
    data.temp < valMin ||
    data.temp > valMax
  ) {
    fueraRango["temp"] = data.temp;
  }

  return fueraRango;
}

// Programa la tarea para que se ejecute, por ejemplo, cada 3 minutos
cron.schedule("*/5 * * * *", () => {
  console.log("Tarea programada obtener OX siendo ejecutada...");
  registrarSensor();

});