const https = require('http')
const schedule = require('node-schedule')
const io = require('socket.io-client')

const socket= io.connect('http://localhost:5000/communication')

function createDriver() {
    let driver = JSON.stringify({
        name : "Driver_"+parseInt(Math.random()*100).toString(),
        car_number : "C-"+parseInt(Math.random()*100).toString(),
        coordinates_x : Math.random()*100,
        coordinates_y : Math.random()*100
    })

    return driver;
}

function createRider() {
    let rider = JSON.stringify({
        name : "Rider_"+parseInt(Math.random()*100).toString(),
        coordinates_x : Math.random()*100,
        coordinates_y : Math.random()*100,
        destination_x : Math.random()*100,
        destination_y : Math.random()*100
    })

    return rider;
}

function createRating(name) {
    let r = JSON.stringify({
        name : name,
        rating : parseInt(Math.random()*10)
    })

    return r;
}

function createOptionsDriver(driver) {
    let optionsDriver = {
        hostname : "localhost",
        //port : 3001,
        port : 4000,
        path : "/rs/driver",
        method : "POST",
        headers : {
            "Content-Type" : 'application/json',
            "Content-Length" : driver.length
        }
    }

    return optionsDriver;
}

function createOptionsRider(rider) {
    const optionsRider = {
        hostname : "localhost",
        //port : 3001,
        port : 4000,
        path : "/rs/rider",
        method : "POST",
        headers : {
            "Content-Type" : 'application/json',
            "Content-Length" : rider.length
        }
    }
    return optionsRider;
}

function createOptionsRating(rating) {
    const optionsRating = {
        hostname : "localhost",
        //port : 3000,
        port : 4000,
        path : "/rating",
        method : "POST",
        headers : {
            "Content-Type" : 'application/json',
            "Content-Length" : rating.length
        }
    }

    return optionsRating
}


const jobDriver = schedule.scheduleJob('*/1 * * * * *', ()=>{

    const driver = createDriver();
    const optionsDriver = createOptionsDriver(driver)
    https.request(optionsDriver).write(driver)
})

const jobRider = schedule.scheduleJob('*/1 * * * * *', ()=>{

    const rider = createRider()
    const optionsRider = createOptionsRider(rider)
    https.request(optionsRider).write(rider);
})


socket.on('hello', (data)=>{

    console.log(data[0]+" is paired with "+data[1]+" fare = "+data[2])

    const rating = createRating(data[0])
    const optionsRating = createOptionsRating(rating)
    https.request(optionsRating).write(rating)
})





