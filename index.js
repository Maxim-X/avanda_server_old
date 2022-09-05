require('dotenv').config();
const  express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || config.get('serverPort');
const router = require('./routes/index');
const path = require('path')
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const {config} = require("dotenv");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static', 'images')))
app.use(fileUpload({}));
app.use('/api', router);


app.use(errorHandler);
if (process.env.NODE_ENV === "production"){
    app.use(express.static('build'));
    app.get('*', (req, res) => {
        req.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    })
}

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        app.listen(PORT, ()=> console.log('Server started'));
    } catch (e){
        console.log(e);
    }
}

start();


