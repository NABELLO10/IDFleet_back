import { Sequelize } from "sequelize";
import db from "../config/db.js";

const TipoNotificacion = db.define('mae_tipo_notificacion', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey:true, 
        autoIncrement:true
    },
    nom_tipo:{
        type: Sequelize.STRING(2000)
    },
   
    est_activo:{
        type: Sequelize.INTEGER
    },
   
    id_empresa:{
        type: Sequelize.INTEGER
    },
},
{
    timestamps: false,
    tableName: 'mae_tipo_notificacion'
})


export default TipoNotificacion