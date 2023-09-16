import express, {Application, Request, Response, Router} from "express";
import bodyParser from 'body-parser';

const app = () : Application => {
    return  express()
}
const myServ = {
    // app : () : Application => {
    //     return express()
    // } ,
    app : app(),
    req : Request ,
    res : Response ,
    bodyParser : bodyParser ,
    router : Router
}
export default myServ