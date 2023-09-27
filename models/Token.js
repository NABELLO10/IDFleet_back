import { Sequelize } from "sequelize";
import db from "../config/db.js";

const Token = db.define('mae_token', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey:true, 
        autoIncrement:true
    },
    usuario:{
        type: Sequelize.STRING(100)
    },
    token:{
        type: Sequelize.STRING(2000)
    },      
},
{
    timestamps: false,
    tableName: 'mae_token'
})




export default Token