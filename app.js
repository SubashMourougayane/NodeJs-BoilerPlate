const express = require('express');
const cluster = require('cluster');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typedefs/index');
const resolvers = require('./graphql/resolvers/index');


const GATEKEEPER = require('./gatekeeper/gatekeeper');

const DB = require('./config/db');


const routeInit = (app) => {

    // add all your middlewares here
    app.use(function (request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, On-behalf-of, x-sg-elas-acl");
        response.header("Access-Control-Allow-Credentials", true);
        response.header("access-control-allow-methods", "*");
        next();
    });
    app.use(cors());

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use((req,res,next)=>{
        
        const token  = req.cookies['dcodeUser'];
        if(token){
            const data = jwt.verify(token,'shhhhh');
            if(data.email){
                req['user'] = data
            }
            next()
        }else{

            next()
        }
        

    })
    app.get("/sample", (req, res) => {
        GATEKEEPER.response(res, 200, {
            Server: process.env.SERVER_NAME,
            Port: process.env.PORT,
            Environment: process.env.ENV,
            Version: require("./package.json").version
        });
    });



}

const connectDB = () => {
    DB.authenticate()
        .then(() => console.log("Database Connected"))
        .catch(err => console.log('Error: ' + err))
}
const init = () => {
    if (cluster.isMaster) {
        const numCPUs = require('os').cpus().length;
        console.log(`Master ${process.pid} is running`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });

    } else {
        var app = express();
        
        
        routeInit(app);
            
        connectDB();

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req,res }) => ({
                req,res                       
            }),
        
        })
        

        server.applyMiddleware({ app })

        DB.sync().then(() => {
            app.listen(process.env.PORT, () => console.log("server listening on port " + process.env.PORT + " in " + process.env.ENV + " mode version is " + require("./package.json").version));
        })
        app.disable('x-powered-by');
    }
};

init();