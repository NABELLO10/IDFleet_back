import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js";

const LogSensores = db.define('log_sensores', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey:true, 
        autoIncrement:true
    },
    patente:{
        type: Sequelize.STRING(10)
    },
    tipo:{
        type: Sequelize.STRING(500)
    },
    detalle:{
        type: Sequelize.TEXT
    },
    fec_add: {
        type: DataTypes.DATE,    
        defaultValue: DataTypes.NOW 
    },  
},
{
    timestamps: false,
    tableName: 'log_sensores'
})


export default LogSensores