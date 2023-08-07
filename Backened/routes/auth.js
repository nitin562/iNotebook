// importing essentials
const express = require("express"); //Express Server
const router = express.Router();
const { check, validationResult } = require("express-validator"); //Validation mechanism
const user = require("../models/Userschema"); //importing schema for user
const bcrypt = require("bcryptjs");
// Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function. The maximum input length is 72 bytes (note that UTF8 encoded characters use up to 4 bytes) and the length of generated hashes is 60 characters
const jwt = require("jsonwebtoken");
const secretKey = require('../db.js').sk; //sign for jwt
//MiddleWare
const fetchdata=require('../middleware/fetchdata.js')
// Endpoint for Creating user- "/createUser"
router.post(
  "/createUser",
  [
    check("name").isLength({ min: 3 }),
    check("email").isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //[check('name')...] is used validation, agar validation import kiya h toh hi likhne ka
    // res->response req->request
    // req->client side se jab post request di jati h with data then us data ko req.body se pa sakte ho
    // res->server side se agar koi response bhejna ho jaise ki pta chal jaiye ki OK hai ya nhi apki request
    try {
      const errors = validationResult(req); //return object containing errors if data is invalid
      if (!errors.isEmpty()) {
        //send response to client about invalid data on post fetch method
        return res
          .status(422)
          .json({ Success:0,message: "error occured", error: errors.mapped() });
      } else {
        //storing
        // const data=matchedData(req)   use kar sakte ho but if-else ke karn, req.body bhi data hi h
        let findDupUser = await user.findOne({ email: req.body.email }); //null hogi ya koi user information
        if (findDupUser) {
          res
            .status(422)
            .json({Success:-1, error: "Duplicate email", email: req.body.email });
          return;
        }
        const salt = await bcrypt.genSalt(10); //default is 10
        const securePassword = await bcrypt.hash(req.body.password, salt);
        const client = await user.create({
          name: req.body.name,
          email: req.body.email,
          password: securePassword,
        });
        const data = {
          user: {
            id: client.id,
          },
        };

        const token = jwt.sign(data, secretKey); //json token
        res.json({Success:1,token });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({Success:0, msg: "error occurred", error: err });
    }
  }
);


//Endpoint for Authentication - Login the user - /login
router.post('/login',[check('email','Enter Valid Email id').isEmail(),check('password','Invalid').exists()],async(req,res)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).json({"message":"Error occurred",error:errors.mapped()})
        }
        const {email,password}=req.body
        let client=await user.findOne({email}) //email act as primary key
        if(!client){
            return res.status(422).json({Success:0,error:{email:"enter correct email"}})
        }
        //matching the password with hashpassword
        const matching=await bcrypt.compare(password,client.password) //returns T|F
        if(!matching){
          return res.status(422).json({Success:0,error:{password:"enter correct password"}})
        }
        //after all checks, now user is logined
        //return token for correct user
        const token=jwt.sign({user:{"id":client.id}},secretKey)
        res.json({Success: 1,username:client.name,token:token})
    }
    catch(err){
        res.status(500).json({"msg":"Some Error occurred in server","error":err})
    }
})
//endpoint for fetching data of client from db. endpt-/fetchClient , it requires login
//login kar chuka h vo that means credentials validation karne ki koi jarurat nhi h
//yaha hum ek middleware function ka use karenge that means phele vo function finish hoga then next function i.e async(req,res) chalega

router.post('/fetchClient',fetchdata,async(req,res)=>{
    try {
        const id=req.user.id
        console.log(id)
        let client=await user.findById(id).select("-password")
        res.status(200).json(client)
    } catch (error) {
        res.status(500).send("Internal Error occurred")
    }
})
module.exports = router;
