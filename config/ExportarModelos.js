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

import CorreosNotificacion from "../models/CorreosNotificacion.js"

const exportarModelos = () =>{
Log, Pais, Region,Provincias,Ciudades,Perfiles,Empresas,Usuarios, EmpresasSistema, TipoNotificacion, Transportistas, CorreosNotificacion,Camiones,Arrastres,Token
}

export default exportarModelos