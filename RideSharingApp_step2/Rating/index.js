const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const Driver = require('./models/driver')

const url="mongodb://localhost/DriverRating"

mongoose.connect(url, {useNewUrlParser:true}, ()=>{
    console.log('connected to db');
})

const app = express();
const server = http.createServer(app);

app.use(express.json())

app.listen(3000, ()=>{
    console.log("Rating Service listening on port 3000")
});

app.post('/rating',async(req,res)=>{

    const driver = new Driver({
        name : req.body.name,
        rating : req.body.rating
    })
    try{
        console.log(driver);
        const a1 = await driver.save()

    } catch(err){
        res.send("Error "+err);
    }
})