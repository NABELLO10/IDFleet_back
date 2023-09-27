import { Sequelize } from "sequelize";


const db = new Sequelize('IdFleetDB', 'sa', '123456', {
    dialect: 'mssql',
    host: '127.0.0.1',
    port: '63837',
     logging: false
  })


export default db