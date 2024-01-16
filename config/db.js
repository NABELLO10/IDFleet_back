import { Sequelize } from "sequelize";

const db = new Sequelize('IdFleetDB', 'sa', '123456', {
    dialect: 'mssql',
    host: '127.0.0.1',
    port: '63837',
     logging: false,
     timezone: '-03:00'
  })

export default db 

/////////////////////////////////// 

/* import { Sequelize } from "sequelize";

const db = new Sequelize('IdFleetDB', 'userIdFleet', 'IdF.2023', {
    dialect: 'mssql',
    host: 'hctec.database.windows.net',
    port: '1433',
     logging: false,
     timezone: '-03:00'
  })


export default db */