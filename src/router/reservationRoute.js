const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Reservation = require('../model/Reservation')
//Parameters:
//name, phoneno, email, date

function is_valid_date(date){
    //Check if the date is in the format YYYY-MM-DD
    try{
        let year, month, day;
        [year, month, day] = date.split("-").map(Number);
        //Check if the year, month and day are in range 
        if (year < 2022 || year > 2030){
            return false;
        }
        if(month < 1 || month > 12){
            return false;
        }
        if (day < 1 || day > 31){
            return false;
        }
        //Check if the date is not in the past
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let inputDate = new Date(year, month-1, day);
        if(inputDate<today){
            return false;
        }
        //if all checks pass, return true 
        return true;
    }catch{
        //if there is an error in parsing the date, return false 
        return false;
    }
}

router.post('/book', async (req,res)=>{
    //Get the name and date from the request body 
    let {name, phoneno, email, date} = req.body;
    //Check if the name and date are valid inputs
    if(!name || !date){
        res.status(400).send("Please enter a name and a date.");
        
    }
    if(!is_valid_date(date)){
        res.status(400).send("Please enter a valid date.");
        
    }
    //Check if the date is not fully booked
    let count = await Reservation.countDocuments({date});
    if(count>=10){
        res.status(400).send("Sorry, this date is fully booked");
        //Create a new reservation document and save it to the database
        let reservation = new Reservation({name, phoneno, email, date});
        await reservation.save();
        //Send a confirmation mmessage as the response
        res.send(`Reservation confirmed for ${name} on ${date}.`)
    }
})

// A route to cancel a reservation
router.delete("/cancel", async (req, res) => {
    // Get the name and date from the request body
    let { name, date } = req.body;
    // Check if the name and date are valid inputs
    if (!name || !date) {
        res.status(400).send("Please enter a name and a date.");
        return;
    }
    if (!is_valid_date(date)) {
        res.status(400).send("Please enter a valid date.");
        return;
    }
    // Check if the name has a reservation for that date
    let reservation = await Reservation.findOne({ name, date });
    if (!reservation) {
        res.status(404).send(`No reservation found for ${name} on ${date}.`);
        return;
    }
    // Delete the reservation document from the database
    await reservation.delete();
    // Send a confirmation message as the response
    res.send(`Reservation cancelled for ${name} on ${date}.`);
});

// A route to view all reservations for a given date
router.get("/view/:date", async (req, res) => {
    // Get the date from the request parameters
    let { date } = req.params;
    // Check if the date is valid input
    if (!date) {
        res.status(400).send("Please enter a date.");
        return;
    }
    if (!is_valid_date(date)) {
        res.status(400).send("Please enter a valid date.");
        return;
    }
     // Find all reservations for that date from the database
     let reservations = await Reservation.find({date});
     // Check if there are any reservations for that date
     if (reservations.length === 0) {
         return res.send(`No reservations for ${date}.`);
     }
     // Send the list of names for that date as the response
     res.send(`Reservations for ${date}: \n${reservations.map(r => r.name).join("\n")}`);
 });

module.exports = router;