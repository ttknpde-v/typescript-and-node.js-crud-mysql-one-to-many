// in TypeScript we recommend to use import instead require()
import myLog from "../log/logging";
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config({path : myLog.path.resolve('../env/.env')})
class ConfigDatabase {
    get sequelizeConfig() : any {
        return new Sequelize (
            process.env.SQLX_DATABASE! ,
            process.env.SQLX_USERNAME!,
            process.env.SQLX_PASSWORD!,
            {
                /* set different port */
                dialect : 'mysql' ,
                host: process.env.SQLX_HOST,
                port:<any> process.env.SQLX_PORT, /* this line specify type => port:<Type You want> */
                pool : {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        ) // ended new sequelize()
    }
}

const configDatabase = new ConfigDatabase()
const myConfigSequelize = {
    connect : configDatabase.sequelizeConfig
}

/*
myConfigSequelize.connect.authenticate().then(() => {
    console.log('connected successfully!!')
}).catch((error : any) => {
    console.log('message : failed connect!!')
    throw error
})
*/
export {
    myConfigSequelize
}
