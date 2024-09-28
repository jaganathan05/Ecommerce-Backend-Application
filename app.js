const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const AdminRoutes = require('./Routes/Admin')
const UserRoutes = require('./Routes/Users')
require('dotenv').config(); 

app.use(express.json());
app.use(cors());
app.use('/admin',AdminRoutes)
app.use(UserRoutes)
console.log(process.env.mongo_db_connection)



mongoose.connect(process.env.mongo_db_connection)
    .then(res => {
        app.listen(4000, () => {
            console.log('Server is running on port 4000');
            console.log('Connected to MongoDB');
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });
