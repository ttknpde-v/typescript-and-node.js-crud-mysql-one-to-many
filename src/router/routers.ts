import myCrud from "../services/crud";
import myLog from "../log/logging";
import myServ from "../services/serv";

const routerProject = myServ.router()
const routerStudent = myServ.router()
const req = myServ.req
const res = myServ.res
const bodyParser = myServ.bodyParser
const crudProject = myCrud.crud_project
const crudStudent = myCrud.crud_student

/* set middleware */
routerProject.use(bodyParser.json())
routerProject.use(bodyParser.urlencoded({extended : true}))
routerStudent.use(bodyParser.json())
routerStudent.use(bodyParser.urlencoded({extended : true}))


routerProject.get('/reads', async (req , res) => {
    await crudProject.reads().then((result) => {
        // @ts-ignore
        return res.status(202).json({
            status:"accepted",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from reads async method from crud project {} : "+errors.message)
        throw errors
    })
})

routerProject.get('/reads-only-projects', async (req , res) => {
    await crudProject.readsOnlyProjects().then((result) => {
        // @ts-ignore
        return res.status(202).json({
            status:"accepted",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from readsOnlyProjects async method from crud project {} : "+errors.message)
        throw errors
    })
})

routerProject.get('/read/(:pid)', async (req , res) => {
    await crudProject.read(req.params['pid']).then((result) => {
        // @ts-ignore
        return res.status(202).json({
            status:"accepted",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from read async method from crud project {} : "+errors.message)
        throw errors
    })
})

routerProject.get('/reads-less-income/(:pincome)', async (req , res) => {
    await crudProject.readsLessThanPincome(req.params['pincome']).then((result) => {
        // @ts-ignore
        return res.status(202).json({
            status:"accepted",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from readsLessThanPincome async method from crud project {} : "+errors.message)
        throw errors
    })
})

routerProject.post('/create-include-student', async (req , res) => {
    const {pid,pname,pincome} = req.body
    const students = req.body.students
    /*
    [
      { sid: 'S01', fullname: 'Kvin Hard', age: 21 },
      { sid: 'S02', fullname: 'Max Ryder', age: 22 },
      { sid: 'S03', fullname: 'Peter Parker', age: 20 }
    ]
    */
    await crudProject.createIncludeStudents(pid,pname,pincome,students).then((result) => {
        return res.status(201).json({
            status:"create",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from createIncludeStudents async method from crud project {} : "+errors.message)
        res.status(412).json({
                status:"Precondition Failed",
                data: {
                    pid : pid ,
                    pname : pname ,
                    pincome : pincome,
                    student : "Maybe, student has existed"
                }
        })
    })
})

routerProject.post('/create', async (req , res) => {
    const {pid,pname,pincome} = req.body
    await crudProject.create(pid,pname,pincome).then((result) => {
        return res.status(201).json({
            status:"create",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from create async method from crud project {} : "+errors.message)
        throw errors
    })
})

routerProject.put('/update/(:pid)', async (req , res) => {
    const {pname,pincome} = req.body
    const pid = req.params['pid']
    await crudProject.update(pname,pincome ,pid).then((result) => {
        return res.status(200).json({
            status:"ok",
            data : result
        })
    }).catch((errors) => {
        throw errors
    })
})

routerProject.delete('/delete/(:pid)', async (req , res) => {
    const pid = req.params['pid']
    await crudProject.delete(pid).then((result) => {
        return res.status(200).json({
            status:"ok",
            data : result
        })
    }).catch((errors) => {
        throw errors
    })
})

/*
*
*
*
*
*
*
*/

routerStudent.get('/reads', async (req , res) => {
    await crudStudent.reads().then((result) => {
        // @ts-ignore
        return res.status(202).json({
            status:"accepted",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from reads async method from crud student {} : "+errors.message)
        throw errors
    })
})

routerStudent.get('/read/(:sid)', async (req , res) => {
    await crudStudent.read(req.params['sid']).then((result) => {
        // @ts-ignore
        return res.status(202).json({
            status:"accepted",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from read async method from crud student {} : "+errors.message)
        throw errors
    })
})

routerStudent.post('/create', async (req , res) => {
    const {sid,fullname,age} = req.body
    await crudStudent.createNullProject(sid,fullname,age).then((result) => {
        return res.status(201).json({
            status:"create",
            data : result
        })
    }).catch((errors) => {
        console.log("something was wrong from create async method from crud student {} : "+errors.message)
        throw errors
    })
})

routerStudent.put('/update/project', async (req , res) => {
    await crudStudent.updateProjectOfStudent(req.body.sid,req.body.pid).then((result) => {
        return res.status(200).json({
            status:"ok",
            data : result
        })
    }).catch((errors) => {
        throw errors
    })
})

const myRouters = {
    routerProject,
    routerStudent
}

export {
    myRouters
}