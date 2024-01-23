import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Sequelize } from "sequelize";

//BASE DE DATOS
import db from "./config/db.js";
import dbAzure from "./config/dbAzure.js";
import exportarModelos from "./config/ExportarModelos.js";

//ROUTES
import loginRoutes from "./routes/loginRoutes.js"
import crudRoutes from "./routes/crudRoutes.js"
import generalRoutes from "./routes/generalRoutes.js"
 
import './controllers/tareas/obtenerOX.js'   
/* import "./controllers/tareas/logTablet.js";   */
import './controllers/tareas/obtenerUnidadesWialon.js'    


//aqui se crea la aplicacion de express
const app = express();

//le decimos que enviaremos datos de tipo json

app.use(express.json());

//busca y agrega el archivo .env
dotenv.config();

//Veriricando modelos al inciar si no existe los crea
exportarModelos();

//conectando a base de datos con sequelize
//await db.authenticate()
 db.sync()
   .then(() => {
     console.log("BD conectada");
   })
   .catch((error) => {
     console.log(error);
   });
 
/*    dbAzure.sync()
   .then(() => {
     console.log("BD AZURE conectada");
   })
   .catch((error) => {
     console.log(error);
   }); */

// async function conectarDB(){
//   try {
//     //await db.authenticate()
//     await db.sync();
//     console.log('BD Conectada a SQL Sever')
//   } catch (error) {
//     console.log(error)
//   }
// }

// conectarDB()


  //Utilizando cors para proteger la api ORIGINAL

  const corsOptions = {
    origin: process.env.FRONTEND_URL, // Asegúrate de que FRONTEND_URL esté correctamente definido en tu archivo .env
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  };
  app.use(cors(corsOptions));
   

  //ROUTES
app.use('/api-emsegur/', loginRoutes)
app.use("/api-emsegur/crud/", crudRoutes);
app.use("/api-emsegur/general/", generalRoutes);



//PUERTOS
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
