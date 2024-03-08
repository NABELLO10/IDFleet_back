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
        obtenerResumenTablet,
        obtenerAlertas,
        obtenerDatosOxFechas,
        obtenerLog,
        obtenerLogConductor,
        logRevisado,
        revisarTodos,
        obtenerLogConductor2,
        inicioConductor,
        obtenerConductorActivo,
        enviarGPS,
        obtenerDatosTabletFechas,
        obtenerLogTablet
             } from "../controllers/generalController.js";


const router = express.Router()

router.get('/obtener-ciudades', checkAuth, obtenerCiudades)
router.put('/token-wialon', checkAuth, actualizarWialon)
router.get('/token-wialon', checkAuth, obtenerTokenWialon)
router.get('/datos-ox/:patente', checkAuth, obtenerDatosOx)
router.get('/datos-ox-fechas/:patente/:desde/:hasta', checkAuth, obtenerDatosOxFechas)
router.get('/datos-tablet-fechas/:patente/:desde/:hasta', checkAuth, obtenerDatosTabletFechas)
router.get('/alertas/:patente', checkAuth, obtenerAlertas)
router.get('/datos-tablet', checkAuth, obtenerResumenTablet)
router.get('/resumenGPS', checkAuth, obtenerResumenGPS)
router.get('/obtenerLog/:patente/:desde/:hasta/:empresa/:transportista', checkAuth, obtenerLog)
router.get('/obtenerLogTablet/:patente/:desde/:hasta', checkAuth, obtenerLogTablet)
router.get('/obtenerLogConductor/:empresa/:transportista/:patente', checkAuth, obtenerLogConductor)


router.get('/listarUnidadesPY', checkAuth, listarUnidadesPY)
router.get('/datosOx', checkAuth, datosOxPY)
router.get('/tControl', checkAuth, tControl)

router.put('/revisarLog/:id', logRevisado)
router.put('/revisarTodos/:patente',  revisarTodos)
router.get('/obtenerLogConductor2/:patente',  obtenerLogConductor2)
router.post('/inicioConductor',  inicioConductor)
router.get('/obtenerConductorActivo/:patente/:rut',  obtenerConductorActivo)
router.post('/enviarGPS',  enviarGPS)



export default router