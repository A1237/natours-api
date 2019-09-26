const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const fs = require('fs')

dotenv.config({
    path: './config.env'
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => console.log('DB connection successful'))

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
console.log(tours)
// IMPORT DATA INTO DB

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('DOCUMENTS CREATED SUCCESSFULY 🤗');

    } catch (error) {
        console.log(error)
    }
    process.exit();
}

// DELTE DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('DOCUMENTS DELETED SUCCESSFULY 🤗');

    } catch (error) {
        console.log(error)
    }
    process.exit();
}


if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] == '--delete') {
    deleteData();
}

console.log(process.argv);