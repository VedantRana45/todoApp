const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./database/databaseConnection');

//Configuration of dotenv
dotenv.config({ path: "config/.env" });


//database connection
connectDatabase();


app.listen(process.env.PORT, () => {
    console.log(`Server is Running on PORT : ${process.env.PORT}`);
})