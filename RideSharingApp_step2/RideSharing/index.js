const express = require('express');
const http = require('http')
const schedule = require('node-schedule')

const app = express();
const server = http.createServer(app);

app.use(express.json())

app.listen(3001, ()=>{
    console.log("RideSharing service listening on port 3001")
});

var riders = []

app.post('/rs/rider',async(req,res)=>{
    try{
        const rider = req.body;

        riders.push(rider)

    } catch(err){
        res.send("Error "+err);
    }
})


var drivers = []

app.post('/rs/driver',async(req,res)=>{
    try{
        const driver = req.body;

        drivers.push(driver)

    } catch(err){
        res.send("Error "+err);
    }
})

function createOptionsMatching(rider_driver){
    const optionsMatching = {
        hostname : "localhost",
        port : 3002,
        path : '/pairMatching',
        method : 'POST',
        headers : {
            "Content-Type" : "application/json",
            "Content-Length" : rider_driver.length
        }
    }

    return optionsMatching;
}

function createPair(driver, rider, dist){
    let pair = JSON.stringify({
        driver_name : driver.name,
        rider_name : rider.name,
        fare : dist * 2
    })

    return pair
}

const job = schedule.scheduleJob("*/5 * * * * *", ()=>{
    for(const driver of drivers) {
        let min = 1000000000;
        let selectedRider = null;
        for(const rider of riders){
            let dist = Math.sqrt((rider.coordinates_x-driver.coordinates_x)*(rider.coordinates_x-driver.coordinates_x)+(rider.coordinates_y-driver.coordinates_y)*(rider.coordinates_y-driver.coordinates_y))
            if(dist<min){
                min = dist
                selectedRider=rider
            }
        }
        const rider_driver = createPair(driver, selectedRider ,min)
        const optionsMatching = createOptionsMatching(rider_driver)
        http.request(optionsMatching).write(rider_driver)
    }
    drivers = []
    riders = []
})