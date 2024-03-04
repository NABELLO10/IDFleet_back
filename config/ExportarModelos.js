import Log from "../models/Log.js";
import Pais from "../models/Pais.js";
import Region from "../models/Region.js";
import Provincias from '../models/Provincias.js'
import Ciudades from '../models/Ciudades.js'
import Perfiles from "../models/Perfiles.js";
import Empresas from "../models/Empresas.js";
import Usuarios from "../models/Usuarios.js";
import EmpresasSistema from "../models/EmpresasSistema.js"
import TipoNotificacion from "../models/TipoNotificacion.js"
import Transportistas from "../models/Transportistas.js"
import Camiones from "../models/Camiones.js"
import Arrastres from "../models/Arrastres.js"
import Token from "../models/Token.js"
import Sensores from "../models/Sensores.js"
import LogSensores from "../models/LogSensores.js"
import CatNotificacion from "../models/CatNotificacion.js"
import ResumenGPS from "../models/ResumenGPS.js"
import Conductores from "../models/Conductores.js"
import ResumenTablet from "../models/ResumenTablet.js"
import UnidadesWialon from "../models/UnidadesWialon.js"
import SesionConductores from "../models/SesionConductores.js"
import GPSTablet from "../models/GPSTablet.js"

import OxSchool from "../models/OxSchool.js";


import CorreosNotificacion from "../models/CorreosNotificacion.js"

const exportarModelos = () =>{
Log, Pais, Region,Provincias,Ciudades,Perfiles,Empresas,Usuarios, EmpresasSistema, TipoNotificacion, Transportistas, CorreosNotificacion,Camiones,Arrastres,Token, Sensores, 
LogSensores, CatNotificacion, ResumenGPS, OxSchool, Conductores, UnidadesWialon, ResumenTablet, SesionConductores, GPSTablet
}

export default exportarModelos