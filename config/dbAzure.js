import { Sequelize } from "sequelize";


const dbAzure = new Sequelize('IdFleetDB', 'userIdFleet', 'IdF.2023', {
    dialect: 'mssql',
    host: 'hctec.database.windows.net',
    port: '1433',
     logging: false,
     timezone: '-03:00'
  })


export default dbAzure