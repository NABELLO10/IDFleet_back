import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {       
        listarUnidadesPY, datosOxPY, tControl
             } from "../controllers/procesos/wialonController.js";
import { 
        obtenerCiudades,
        actualizarWialon,
        obtenerTokenWialon,
        obtenerDatosOx,
        obtenerResumenGPS,
        obtenerDatosSchool,
        obtenerAlertas,
        obtenerDatosOxFechas,
        obtenerLog
             } from "../controllers/generalController.js";


const router = express.Router()

router.get('/obtener-ciudades', checkAuth, obtenerCiudades)
router.put('/token-wialon', checkAuth, actualizarWialon)
router.get('/token-wialon', checkAuth, obtenerTokenWialon)
router.get('/datos-ox/:patente', checkAuth, obtenerDatosOx)
router.get('/datos-ox-fechas/:patente/:desde/:hasta', checkAuth, obtenerDatosOxFechas)
router.get('/alertas/:patente', checkAuth, obtenerAlertas)
router.get('/datos-tablet', checkAuth, obtenerDatosSchool)
router.get('/resumenGPS', checkAuth, obtenerResumenGPS)
router.get('/obtenerLog/:patente/:desde/:hasta', checkAuth, obtenerLog)


router.get('/listarUnidadesPY', checkAuth, listarUnidadesPY)
router.get('/datosOx', checkAuth, datosOxPY)
router.get('/tControl', checkAuth, tControl)



export default router