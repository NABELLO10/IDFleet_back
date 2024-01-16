import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js";

import Transportista from "./Transportistas.js";
import Arrastres from "./Arrastres.js";
import EmpresasSistema from "./EmpresasSistema.js";

const Camiones = db.define('mae_camiones', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey:true, 
        autoIncrement:true
    },    
    id_transportista:{
        type: Sequelize.INTEGER
    },   
    id_arrastre:{
        type: Sequelize.INTEGER
    },   
    nom_patente:{
        type: Sequelize.STRING
    }, 
    fec_rev_tecnica:{
        type: Sequelize.STRING(20)
    },
    fec_per_circulacion:{
        type: Sequelize.STRING(20)
    },  
    fec_seguro:{
        type: Sequelize.STRING(20)
    },  
    est_activo:{
        type: Sequelize.INTEGER
    },       
    id_empresa:{
        type: Sequelize.INTEGER
    },
    id_empresa_global:{
        type: Sequelize.INTEGER
    },
    est_asignado:{
        type: Sequelize.INTEGER
    }, 
    id_wialon:{
        type: Sequelize.INTEGER
    },   
    est_ox:{
        type: Sequelize.INTEGER
    },   
},
{
    timestamps: true,
    tableName : 'mae_camiones'
})

Camiones.belongsTo(Transportista, {foreignKey : "id_transportista"})
Camiones.belongsTo(Arrastres, {foreignKey : "id_arrastre"})
Camiones.belongsTo(EmpresasSistema, {foreignKey : "id_empresa"})


export default Camiones;
