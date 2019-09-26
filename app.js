const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();


// * ********** Middlewares ***************

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// app.use((req, res, next) => {
//     console.log('welcome from the middleware 🧡💛');
//     next();
// });

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.requestTime)
    next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// * ********** Middlewares ***************

module.exports = app;