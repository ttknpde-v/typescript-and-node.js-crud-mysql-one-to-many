// const path = require('path') can use
import path from 'path'
import {createLogger , format , transports} from 'winston'
class Logging {
    static get log () {
        return createLogger({
            level : 'silly' ,
            format : format.
            combine(
                format.label({label: path.basename(process.mainModule?.filename!)}) , //( ! ) mean non-null assertion operator
                format.timestamp({format : 'YYYY-MM-DD HH:mm:ss'}) ,
                format.printf((info:any) => `${info.timestamp} ${info.level} [${info.label}] : ${info.message}`)
            ) ,
            transports : [ new transports.Console ]
        })
    }
}
// create myLog object for exporting
const myLog = {
    log : Logging.log ,
    path : path
}
export default myLog