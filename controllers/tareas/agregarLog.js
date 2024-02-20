// Este es tu controlador, por ejemplo, sensorController.js
import ResumenGPS from "../../models/ResumenGPS.js";
import Camiones from "../../models/Camiones.js";
import cron from "node-cron";
import TipoNotificacion from "../../models/TipoNotificacion.js";
import LogSensores from "../../models/LogSensores.js";
import emailNotificaciones from "../../helpers/emailNotificaciones.js";
import moment from 'moment-timezone';

const fechaChile = moment.tz(new Date(), 'America/Santiago').format('YYYY-MM-DD HH:mm:ss');

// Esta es la tarea que deseas programar
const registrarLog = async () => {
    const datosGpsOX = await ResumenGPS.findAll({
      where:{
        est_ox : 1 
      }
    })

    datosGpsOX.map((data) => {
        guardarLogOX(data)
    })
       
    //alertas de temperatura
    const datosGpsTEMP = await ResumenGPS.findAll({
      where:{
        est_temp : 1 
      }
    })
  
    datosGpsTEMP.map((data) => {
        guardarLogTemp(data)
    })
}

// Log OX
 async function guardarLogOX(data) {
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
/* 
      emailNotificaciones({
        des: JSON.stringify(fueraRango),
        fecha: fechaChile,
        tipo_alerta: "OXIGENACIÓN",
        cat_alerta: 1,
        patente: data.patente,
        origen: "GPS",
        transportista,
      });     */
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


// Log TEMP
async function guardarLogTemp(data) {
  const empresaUnidad = await Camiones.findAll({
    attributes: ["id_empresa", "id_transportista"],
     where: {
      nom_patente: data.patente
    }, 
  });

  // Obteniendo el id_empresa e id_transportista
  const idEmpresa = empresaUnidad.map((unidad) => unidad.id_empresa);
  const idTransportista = empresaUnidad.map((unidad) => unidad.id_transportista);
  
  const fueraRangotemp = await checkTemp(data, idEmpresa, idTransportista);

  if (Object.keys(fueraRangotemp).length) {
    // Guarda en la tabla de logs
    idTransportista.map(transportista => {
      LogSensores.create({
        patente: data.patente,
        tipo: "Temperatura GPS fuera de límites",
        detalle: JSON.stringify(fueraRangotemp),
        fecha: new Date(),
        id_transportista : transportista,
        fechaRegistro : new Date().toISOString().split('T')[0],
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
        est_alerta_temp: 1,
      },
      {
        where: {
          id_wialon: data.id_wialon,
        },
      }
    );
  }
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
cron.schedule("*/2 * * * *", () => {
  console.log("Tarea registrar LOG GPS siendo ejecutada...");
  registrarLog();
});
