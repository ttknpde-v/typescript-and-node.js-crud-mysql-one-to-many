import myProject from "../entities/many/project";
import myStudent from "../entities/one/student";
import myLog from "../log/logging";
import {myConfigSequelize} from "../connect/configdatabase";

/*
    Many to One
*/
const Student = myStudent.student
const Project = myProject.project
// https://stackoverflow.com/questions/15760994/how-to-model-one-to-many-association-in-sequelize
Student.hasOne(Project,{ foreignKey: 'pid'})
Project.hasMany(Student , { foreignKey: 'pid'})
// Project.belongsTo(Student,{ foreignKey: 'pid'})
Project.removeAttribute('id')


class CrudProject {
    reads = async ()=> {
        try {
            return await Project.findAll({
                include: [{
                    model : Student , attributes :{ exclude:['pid'] }
                }] ,
                attributes : {exclude:['pid']}
            }).catch((err : any) => {
                myLog.log.debug("check reads method (await Project.findAll()) : "+err.message)
                throw err
            })
        } catch (err:any) {
            myLog.log.debug("check reads method (async) : "+err.message)
            throw err
        }
    /** SELECT `projects`.`pid`, `projects`.`pname`, `projects`.`pincome`,
     * `student`.`sid` AS `student.sid`, `student`.`fullname` AS `student.fullname`, `student`.`age` AS `student.age`, `student`.`pid` AS `student.pid`
     * FROM `projects` AS `projects` LEFT OUTER JOIN `students` AS `student`
     * ON `projects`.`pid` = `student`.`pid`; */
    }
    readsOnlyProjects = async ()=> {
        try {
            return await Project.findAll({
                attributes : {exclude:['pid']}
            }).catch((err : any) => {
                myLog.log.debug("check readsOnlyProjects method (await Project.findAll()) : "+err.message)
                throw err
            })
        } catch (err:any) {
            myLog.log.debug("check readsOnlyProjects method (async) : "+err.message)
            throw err
        }
    }
    read = async (pid:string) => {
        const message : string = 'not existed'
        try {

            const project = await Project.findAll({
                where : {pid : pid}
            }).catch((err : any) => {
                myLog.log.debug("check read method (await Project.findAll({where})) : "+err.message)
                throw err
            })

            if (project.length !== 0) {
                return project
            }
            else {
                myLog.log.info(`pid : ${pid} not existed `)
                return message
            }

        } catch (err:any) {
            myLog.log.debug("check read method (async) : "+err.message)
            throw err
        }

    }
    readsLessThanPincome = async (pincome: number | string | unknown) => {
        const message : string = `no data , That incomes less than ${pincome}`
        try {
            // don't forget await before query by Sequelize
            // this way below
            // we called
            /* Writing Row sql  */
            const projects = await myConfigSequelize.connect.query('select pname,pincome from projects where pincome <= :pincome' ,
                {
                replacements: { pincome: pincome } ,
                /*
                    Why it returns same value ?
                    The first object is the result object,
                    the second is the metadata object (containing affected rows etc) - but in mysql, those two are equal.
                    Passing { type: Sequelize.QueryTypes.SELECT } as the second argument will give you a single result object (metadata object omitted)
                 */
                type: myConfigSequelize.connect.QueryTypes.SELECT
            }).catch((err:any) => {
                myLog.log.debug("check readsLessThanPincome method (await query()) : "+err.message)
                throw err
            })

            if (projects.length !== 0) {
                return projects
            }
            else {
                return message
            }
        } catch (err:any) {
            myLog.log.debug("check readsLessThanPincome method (async) : "+err.message)
            throw err
        }
    }
    /* This way below I'll create multiple tables in createIncludeStudents() method/function
    *   */
    createIncludeStudents = async (pid : string , pname : string , pincome : number , students : any) => {

        try {
            return await Project.create(
                { pid,pname,pincome,students },
                { include: Student }
            ).catch((err:any) => {
                myLog.log.debug("check createIncludeStudents method (await create()) : "+err.message)
                throw err
            })
        } catch (err : any) {
            myLog.log.debug("check createIncludeStudents method (async) : "+err.message)
            throw err
        }
    /**
     Executing (default): INSERT INTO `projects` (`pid`,`pname`,`pincome`) VALUES (?,?,?);
     Executing (default): INSERT INTO `students` (`sid`,`fullname`,`age`,`pid`) VALUES (?,?,?,?);
     Executing (default): INSERT INTO `students` (`sid`,`fullname`,`age`,`pid`) VALUES (?,?,?,?);
     Executing (default): INSERT INTO `students` (`sid`,`fullname`,`age`,`pid`) VALUES (?,?,?,?);
     */
    }
    create = async (pid : string , pname : string , pincome : number) => {
        try {
            return await Project.create(
                { pid,pname,pincome }
            ).catch((err:any) => {
                myLog.log.debug("check create method (await create()) : "+err.message)
                throw err
            })
        } catch (err : any) {
            myLog.log.debug("check create method (async) : "+err.message)
            throw err
        }
    }
    update = async (pname : string , pincome : number ,pid : string) => {
        const message : string = `update ${pincome} was`
        try {
            const project = await Project.findAll({where : {pid : pid}}).catch((err : any) => {
                myLog.log.debug("check update method (await Project.findAll({where})) : "+err.message)
                throw err
            })
            if (project.length !== 0) {
                await Project.update({pname : pname , pincome : pincome} , {where : {pid : pid}}).then(()=> {
                    return message+' done'
                })
            }
            else {
                return message+'n\'t successful'
            }
        } catch (err : any) {
            myLog.log.debug("check update method (async) : "+err.message)
            throw err
        }
        /**
         Executing (default): INSERT INTO `projects` (`pid`,`pname`,`pincome`) VALUES (?,?,?);
         Executing (default): INSERT INTO `students` (`sid`,`fullname`,`age`,`pid`) VALUES (?,?,?,?);
         Executing (default): INSERT INTO `students` (`sid`,`fullname`,`age`,`pid`) VALUES (?,?,?,?);
         Executing (default): INSERT INTO `students` (`sid`,`fullname`,`age`,`pid`) VALUES (?,?,?,?);
         */
    }

    delete = async (pid:string) => {
        let message : string = `can't destroy because , found student in project ${pid}`
        try {
            const student = await Student.findAll({where : {pid : pid}})
            if (student.length === 0) {
                const project = await Project.findAll({where : {pid : pid}})
                if (project.length !== 0) {
                    await Project.destroy({where : {pid : pid}})
                    message = 'deleted'
                    return message
                } else {
                    message = `can't destroy because , project ${pid} didn't exist`
                    return message
                }
            }
            else {
                return message
            }
        } catch (err : any) {
            myLog.log.debug("check delete method (async) : "+err.message)
            throw err
        }
    }

}

class CrudStudent {
    reads = async ()=> {
        try {
            return await Student.findAll({
                attributes : {exclude:['pid']}
            }).catch((err : any) => {
                myLog.log.debug("check reads method (await Student.findAll()) : "+err.message)
                throw err
            })
        } catch (err:any) {
            myLog.log.debug("check reads method (async) : "+err.message)
            throw err
        }
    }

    read = async (sid:string) => {
        const message : string = 'not existed'
        try {

            const student = await Student.findAll({
                where : {sid : sid}
            }).catch((err : any) => {
                myLog.log.debug("check read method (await Student.findAll({where})) : "+err.message)
                throw err
            })

            if (student.length !== 0) {
                return student
            }
            else {
                myLog.log.info(`sid : ${sid} not existed `)
                return message
            }

        } catch (err:any) {
            myLog.log.debug("check read method (async) : "+err.message)
            throw err
        }

    }

    createNullProject = async (sid : string , fullname : string , age : number) => {
        try {
            const pid : null = null
            return await Student.create(
                { sid,fullname,age, pid }
            ).catch((err:any) => {
                myLog.log.debug("check createNullProject method (await create()) : "+err.message)
                throw err
            })
        } catch (err : any) {
            myLog.log.debug("check createNullProject method (async) : "+err.message)
            throw err
        }
    }

    updateProjectOfStudent = async (sid : string , pid : string) => {
        const message : string = `update ${sid} was`
        try {
            const student = await Student.findAll({where : {sid : sid}}).catch((err : any) => {
                myLog.log.debug("check updateProjectOfStudent method (await Student.findAll({where})) : "+err.message)
                throw err
            })
            if (student.length !== 0) {
                await Student.update({pid : pid} , {where : {sid : sid}}).then(()=> {
                    return message+' successful'
                })
            }
            else {
                return message+'n\'t successful'
            }
        } catch (err : any) {
            myLog.log.debug("check updateProjectOfStudent method (async) : "+err.message)
            throw err
        }
    }


}

const crudProject = new CrudProject()
const crudStudent = new CrudStudent()
const myCrud = {
    crud_project : crudProject ,
    crud_student : crudStudent
}
export default myCrud
