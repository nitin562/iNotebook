const connect=require('./db.js')     //getting function from db.js
connect.connectionfunc()  //establish the connection
//importing express
const express = require('express')
const app = express()    //using express server with port 5000 as reactjs will use 3000
const port = 5000
const cors=require('cors')
app.use(cors({ origin: true, credentials: true }));
//this is a middleware that helps to display output as json
app.use(express.json())


//creating routes means agar /api/auth par request bhejo tho vo routes/auth.js me endpoints ka use karegi
// ye isliye taki alag files me kaam ho sake, ek file me sab congested inefficient hota h
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
//if auth and notes js are empty file that dont give any endpoints then it shows crashed.
//below is the initial respond of endpoint '/'
app.get('/', (req, res) => {
  res.send('Hello World!')
})


// it builts connection between express server and us. just like ears of server
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})