const express = require("express");
const dbConnection = require("./db/DbConnection");
const cookieParser = require('cookie-parser');
const routes = require("./routes");

const app = express()
require("dotenv").config();

const PORT = 5000

app.use(express.json())
app.use(cookieParser());

dbConnection()

// All Routes
routes.forEach(({ path, route }) => {
    app.use(path, route);
});


app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })