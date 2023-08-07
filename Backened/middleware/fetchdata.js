const jwt = require("jsonwebtoken");
const secretKey = require("../db.js").sk;
const fetchdata = (req, res, next) => {
    const token = req.header("auth-token");
    // console.log(token)
    if (!token) {
       return res.status(401).send("Token is empty");
      }
  try {
    const data = jwt.decode(token, secretKey);
    req.user = data.user;
    next() //IMP as it calls async(Req,res)
  } 
  catch (error) {
    res.status(401).send("Invalid Token")
  }
};
module.exports=fetchdata
