import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { 
        obtenerCiudades,
        actualizarWialon,
        // obtenerClientes,
        // obtenerRequerimientos,
        // obtenerLugaresCliente,
        // obtenerPersonal,
        // obtenerCliente,
        // obtenerServicios,
        // obtenerEmpleados,
        // obtenerEstadosProcesosOT,
        // obtenerEstadosOtros,
        // obtenerTraSer,
        // obtenerProductosOT,
        // obtenerLogCorreos,
        // actualizarFacturado
             } from "../controllers/generalController.js";

const router = express.Router()

router.get('/obtener-ciudades', checkAuth, obtenerCiudades)
router.put('/token-wialon', checkAuth, actualizarWialon)
// router.post('/add_log', checkAuth, registrarLogs)
// router.get('/obtener-clientes/:id_empresa', checkAuth, obtenerClientes)
// router.get('/obtener-cliente/:id', checkAuth, obtenerCliente)
// router.get('/obtener-requerimientos/:id_empresa', checkAuth, obtenerRequerimientos)
// router.get('/obtener-lugares-cliente/:id', checkAuth, obtenerLugaresCliente)
// router.get('/obtener-personal/:cargo/:id_empresa', checkAuth, obtenerPersonal)
// router.get('/obtener-empleados/:cargo/:id_empresa', checkAuth, obtenerEmpleados)
// router.get('/obtener-servicios/:id_empresa', checkAuth, obtenerServicios)
// router.get('/obtener-estadosProOT/:id_empresa', checkAuth, obtenerEstadosProcesosOT)
// router.get('/obtener-estadosOtros/:id_empresa', checkAuth, obtenerEstadosOtros)
// router.get('/obtener-TraSer/:ot', checkAuth, obtenerTraSer)
// router.get('/obtener-productosOT/:ot', checkAuth, obtenerProductosOT)
// router.get('/obtener-logCorreos/:ot', checkAuth, obtenerLogCorreos)
// router.put('/actualizar-facturado/:ot', checkAuth, actualizarFacturado)


export default router