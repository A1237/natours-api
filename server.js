const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config({
    path: './config.env'
});

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB connection successfull'))



const port = process.env.PORT || 85;
app.listen(port, '127.0.0.1', () => {
    console.log(`listening to PORT:${port}`);
});