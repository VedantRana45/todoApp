const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"));
})

//Routes settings
const userRoute = require('./routes/userRoutes');
app.use("/api/v1", userRoute);


module.exports = app;