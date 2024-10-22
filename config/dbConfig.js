const mongoose = require('mongoose')

const dbConnect = () =>{
    mongoose.connect(`mongodb://localhost:27017/ecommerce`)
    .then((result)=>{
        console.log(`Db connection success`);
    }).catch((err) =>{
        console.log(`Db connection failed`);
    })
    return dbConnect
}

module.exports = dbConnect()