import myServ from "../services/serv";
import myLog from "../log/logging";
import {myRouters} from "../router/routers";

class ControllersPath {
    public displayLogic() {
        const app = myServ.app
         app.use('/api',myRouters.routerProject)
         app.use('/api/student',myRouters.routerStudent)
         /* Use // @ts-ignore to ignore the type checking errors on the next line */
         // @ts-ignore
         app.listen(3000,(err : any)=>{
            if (err) {
                myLog.log.debug('found error on port 3000')
                throw err
            }
            myLog.log.info('you are on http://localhost:3000/api/')
         })
    }
}

new ControllersPath().displayLogic()