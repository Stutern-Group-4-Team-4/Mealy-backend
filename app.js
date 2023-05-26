// Env variables
 require("dotenv").config();

//express
const express = require("express");
const router = express.Router();

//mongodb user model
const User = require("./src/model/user.model")

const mongoose = require("mongoose")
const morgan = require("morgan")

//database
const connectDB = require("./src/db/connect");

//  routers
const authRouter = require("./src/router/authRoutes");
const userRouter = require("./src/router/userRoutes");

// middleware
const notFoundMiddleware = require("./src/middlewares/not-found");


//Password handler
const bcrypt = require("bcrypt")

//Env variables
require("dotenv").config();

//path for static verified page
const path = require("path")




//mongodb user otp verification model
const userOTPverification = require("./src/model/userOTPverification")

const app = express();


//Database connection
// mongoose.connect(config.mongodb_connection_url).then(()=>console.log("Database Connection Established")).catch((e)=>console.log(e.message));

//PORT
const port = process.env.PORT || 4000;

//Setting Up The Port
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(notFoundMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);


//Global Error Handler
app.use((err, req, res, next)=>{
    return res.status(err.status || 404).json({
        message: err.message,
        status: "Failed"
    })
})


//     const data={
//         name: req.body.name,
//         password:req.body.password,
// }
//     try{
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         users.push({
//             id: Date.now().toString(),
//             fullName: req.body.name,
//             email: req.body.email,
//             password: req.body.password
//         })
//         res.redirect("./login")
//     }catch(e){
//         console.log(e)
//         res.redirect("./signUp")

//     }
// await collection.insertMany([data])
// res.render()
// })

//send otp verification mail
const sendOTPverificationEmail = async({_id, email}, res)=>{
    try {
        const otp = $(Math.floor(100000 + Math.random() * 900000))
        
        //mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your Email",
            html: "<p>Enter <b>$(otp)</b> in the app to verify your email address and complete verification process.</p><p>This code <b>expires in 1 hour</b></p>"
        };
        
        //hash the otp
        const saltrounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltrounds);
        const newOTPverification = new userOTPverification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now()*3600000
        });

        //save otp record
        await newOTPverification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data:{
                userId: _id,
                email
            }

        })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
        
    }
};

//Verify otp email
router.post("/verifyOTP", async(req,res)=>{
    try {
        let{userId, otp} = req.body;
        if(!userId || !otp){
            throw Error("Empty otp details are not allowed")
        }else{
           const userOTPverificationRecords = await userOTPverification.find({
            userId

            });
            
        }
        if(userOTPverificationRecords.length<=0){
            //no records found
            throw new Error(
                "Account record doesn't exist or has been verified already. Please log in or sign up"
            )
                
        }else{
            //user otp record exists
            const {expiresAt} = userOTPverificationRecords[0];
            const hashedOTP = userOTPverificationRecords[0].otp;

        if (expiresAt<Date.now()) {
            //user otp record has expired
           await userOTPverification.deleteMany({userId})
           throw new Error("Code has expired. Please request again")

            
        } else {
            const validOTP = await bcrypt.compare(otp, hashedOTP)

            if (!validOTP) {
                //supplied otp is wrong
                throw new Error("Invalid code passed. Check your inbox.")
                
            } else {
                //success
                await User.updateOne({_id: userId}, {verified: true});
                await userOTPverification.deleteMany({userId})
                res.json({
                    status: "VERIFIED",
                    message: "User email verified successfully"
                })
                
            }
            
        }
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
        
    }
    
})

//resend otp verification
router.post("/resendOTPverificationCode", async (req,res)=>{
    try {
        let {userId, email}=req.body;
        if(!userId || !email){
            throw Error("Empty user details are not allowed")
        }else{
            //delete existing records and resend
            await userOTPverification.deleteMany({userId})
            sendOTPverificationEmail({_id: userId, email}, res)
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
        
    }
})
app.post("./login", async(req, res)=>{
try{
    const check=await collection.findOne({name: req.body.name})

    if(check.password===req.body.password){
        res.render()
    }else{
        res.send("wrong password")
    }

}catch{
    res.send("wrong details")
}
res.render()
})