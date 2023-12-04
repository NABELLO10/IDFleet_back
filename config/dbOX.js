import { Sequelize } from "sequelize";


const db = new Sequelize('SCHOOL', 'sa', '123456', {
    dialect: 'mssql',
    host: '127.0.0.1',
    port: '63837',
     logging: false,
     timezone: '-03:00'
  })


export default db