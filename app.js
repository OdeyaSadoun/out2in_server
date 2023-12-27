const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const cookieParser = require('cookie-parser')

const { routesInit } = require("./api/routes/config_routes");
require("./api/db/mongoConnect");

const app = express();

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

routesInit(app);

const server = http.createServer(app);
let port = process.env.PORT || 3001;

server.listen(port, () =>{
    console.log(`server running in port ${port}`);
})

