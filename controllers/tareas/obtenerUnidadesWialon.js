// Este es tu controlador, por ejemplo, sensorController.js
import UnidadesWialon from "../../models/UnidadesWialon.js";
import Token from "../../models/Token.js";
import cron from "node-cron";
import { exec } from "child_process"; 
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path"; //

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let arrayResultado = [];


const registrarUnidades = async () => {
  const token = await Token.findOne({
    attributes: ["token"],
    where: {
      id: 1,
    },
  });
  const scriptPath = join(__dirname, "../procesos/Listar_Unidades.py"); 

  try {
    const resultado = await execAsync(`python ${scriptPath} ${token.token}`);
    arrayResultado = JSON.parse(resultado.stdout);
  } catch (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  

  arrayResultado.map(async (r) => {

    const existe = await UnidadesWialon.findAll({
      where: {
        id_wialon: r.id,
      },
    });

    if (existe.length == 0) {          
      await UnidadesWialon.create({
        nm: r.nm,
        id_wialon: r.id,
        mu: r.mu,
        longitud: r.Longitud,
        uacl: r.uacl,
        altitud: r.Altitud,
      });
    }else{
      await UnidadesWialon.update(
        {
          nm: r.nm,
          mu: r.mu,
          longitud: r.Longitud,
          uacl: r.uacl,
          altitud: r.Altitud,
        },
        {
          where: {
            id_wialon: r.id,
          },
        }
      );  

    }
  });
};

// cada 15 minutos
cron.schedule("*/10 * * * *", () => {
  console.log("Tarea obtener unidades siendo ejecutada...");
  registrarUnidades();
});
