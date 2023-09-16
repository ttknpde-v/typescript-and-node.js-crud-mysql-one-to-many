import {myConfigSequelize } from "../../connect/configdatabase";
import {DataTypes} from 'sequelize'
class Project {
    public static getProject () : any {
         return myConfigSequelize.connect.define('projects', {
             pid : {
                 type : DataTypes.STRING ,
                 primaryKey : true
             } ,
             pname : {
                 type : DataTypes.STRING
             } ,
             pincome : {
                 type : DataTypes.DECIMAL
             }
         } , {
            // freeze name table not using *s on name
            freezeTableName: true ,
            // don't use createdAt/update
            timestamps: false
        })
    }
}

const myProject = {
    project : Project.getProject()
}
export default myProject