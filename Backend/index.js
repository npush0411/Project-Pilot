const express = require('express');
const app = express();  

require("dotenv").config();
PORT = process.env.PORT || 4000;
app.listen();

//middleware need to parse json request body 
app.use(express.json());

//Import routes for todo api
const Routes = require("./routes/routes");
//mount the todo
app.use("/api/v1", Routes);

//start server
app.listen(PORT, () => {
    console.log(`Server Started !! at ${PORT}`);
})

//connect the database
const dbConnect = require("./config/database");
dbConnect();
