
import { Sequelize } from "sequelize";
import db from "../config/db.js";

const Sensores = db.define('mov_oxigenacion',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    patente:{
        type: Sequelize.STRING(20)
    },
    fechaGPS:{
        type: Sequelize.STRING(200)
    },
    fechaDato:{
        type: Sequelize.STRING(200)
    },
    nomSensor:{
        type: Sequelize.STRING(200)
    },
    velocidad:{
        type: Sequelize.STRING(200)
    },
    latitud:{
        type: Sequelize.STRING(200)
    },
    longitud:{
        type: Sequelize.STRING(200)
    },
    curso:{
        type: Sequelize.STRING(200)
    },
    altitud:{
        type: Sequelize.STRING(200)
    },
    ox1:{
        type: Sequelize.STRING(200)
    },
    ox2:{
        type: Sequelize.STRING(200)
    },   
    ox3:{
        type: Sequelize.STRING(200)
    },
    ox4:{
        type: Sequelize.STRING(200)
    },
    ox5:{
        type: Sequelize.STRING(200)
    },
    ox6:{
        type: Sequelize.STRING(200)
    },
    ox7:{
        type: Sequelize.STRING(200)
    },
    ox8:{
        type: Sequelize.STRING(200)
    },
    ox9:{
        type: Sequelize.STRING(200)
    },
    temp:{
        type: Sequelize.STRING(200)
    },
    fecha:{
        type: Sequelize.STRING(20)
    },
    time:{
        type: Sequelize.STRING(10)
    },
    fechaRegistro: {
        type: Sequelize.DATE, // O Sequelize.DATETIME si también quieres la hora
        defaultValue: Sequelize.NOW
    },
    est_alerta:{
        type: Sequelize.INTEGER
    },
},
{
    timestamps: false,
    tableName: 'mov_oxigenacion'
})


export default Sensores

