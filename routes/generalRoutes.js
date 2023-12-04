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
        obtenerAlertas
             } from "../controllers/generalController.js";


const router = express.Router()

router.get('/obtener-ciudades', checkAuth, obtenerCiudades)
router.put('/token-wialon', checkAuth, actualizarWialon)
router.get('/token-wialon', checkAuth, obtenerTokenWialon)
router.get('/datos-ox/:patente', checkAuth, obtenerDatosOx)
router.get('/alertas/:patente', checkAuth, obtenerAlertas)
router.get('/datos-school', checkAuth, obtenerDatosSchool)
router.get('/resumenGPS', checkAuth, obtenerResumenGPS)

router.get('/listarUnidadesPY', checkAuth, listarUnidadesPY)
router.get('/datosOx', checkAuth, datosOxPY)
router.get('/tControl', checkAuth, tControl)



export default router