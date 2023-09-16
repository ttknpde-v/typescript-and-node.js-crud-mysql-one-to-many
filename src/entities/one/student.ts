import {myConfigSequelize} from "../../connect/configdatabase";
import {DataTypes} from 'sequelize'
class Student {
    public static getStudent(): any {
        return myConfigSequelize.connect.define('students', {
                sid: {
                    type: DataTypes.STRING,
                    primaryKey: true
                },
                fullname: {
                    type: DataTypes.STRING
                },
                age: {
                    type: DataTypes.INTEGER
                },
                pid : {
                    type :DataTypes.STRING ,
                    references: { // setting details foreign key field
                        model: 'projects', // map this field to table
                        key: 'pid' // reference of this field
                    }
                }
            } , {
            // freeze name table not using *s on name
            freezeTableName: true ,
            // don't use createdAt/update
            timestamps: false
        })
    }
}

const myStudent = {
    student : Student.getStudent()
}

export default myStudent