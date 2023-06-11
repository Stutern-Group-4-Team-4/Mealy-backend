const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Day = require('../model/Day')
;
//Parameters for route;
router.post('/', (req,res,next)=>{
    console.log('Request attempted');
    console.log(req.body);

    const dateTime = new Date(req.body.date);
    Day.find({date:dateTime},(err,docs)=>{
        if(!err){
            if(docs.length>0){
                //Record already exists
                console.log('Record exists. Sent docs.')
                res.status(200).send(docs[0])
            }else{
                //Searched date does not exist and we need to create
                const allTables = require('../data/allTables')
                const day = new Day({
                    date: dateTime,
                    tables: allTables
                })
                day.save(err=>{
                    if(err){
                        res.status(400).send('Error saving new data')
                    }else{
                        //Saved data and we need to return all tables
                        console.log('Created new datetime. Here are default docs')
                        Day.find({date: dateTime}, (err,docs)=>{
                            err? res.sendStatus(400):res.status(200).send(docs[0])
                        })
                    }
                })
            }
        }else{
            res.status(400).send('Could not search for date')
        }
    })
})

module.exports = router;