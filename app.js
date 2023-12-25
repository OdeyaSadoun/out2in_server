const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");

const { routesInit } = require("./api/routes/config_routes");
require("./api/db/mongoConnect");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

routesInit(app);

const server = http.createServer(app);
let port = process.env.PORT || 3001;

server.listen(port, () =>{
    console.log(`server running in port ${port}`);
})

