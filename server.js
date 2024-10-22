const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http')
const dbConnect = require('./config/dbConfig')
const app = express();
dbConnect

//routers
const userRouter = require('./routers/userRoute')
const itemRouter =require('./routers/itemRoute')
const cartRouter = require('./routers/cartRoute')
const orderRouter = require('./routers/orderRoute')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRouter)
app.use(itemRouter)
app.use(cartRouter)
app.use(orderRouter)

const server = http.createServer(app)
server.listen(process.env.PORT,()=>{
  console.log('Server running on port 8000');
})

