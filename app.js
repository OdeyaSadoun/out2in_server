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
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cookieParser());
app.get('/proxy/data', async (req, res) => {
    const DATA_GOV_URL = 'https://data.gov.il/api/3/action/datastore_search?resource_id=a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3';

    try {
        const response = await axios.get(DATA_GOV_URL, {
            params: req.query,
            headers: {
                // הוסף כל הכותרות הדרושות אם יש צורך
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});


routesInit(app);

const server = http.createServer(app);
let port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`server running in port ${port}`);
})


//wake up the server
