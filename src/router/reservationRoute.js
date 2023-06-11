const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Day = require('../model/Day')
const Reservation = require('../model/Reservation')
//Parameters:
//date, table, name, phoneno, email

router.post('/', (req,res,next)=>{
    Day.find({date: req.body.date},(err,days)=>{
        if(!err){
            if(days.length>0){
                let days = days[0]
                days.tables.forEach(table=>{
                    if(table._id==req.body.table){
                        //Correct table is table
                        table.reservation=new Reservation({
                            name: req.body.name,
                            phoneno: req.body.phoneno,
                            email: req.body.email
                        })
                        table.isAvailable = true;
                        days.save(err=>{
                            if(err){
                                console.log(err)
                            }else{
                                console.log('reserved')
                                res.status(200).send('Added Reservation')
                            }
                        })
                    }
                })
            }else{console.log('Day not found')}
        }
    })
})