const mongoose = require('mongoose')
// create schema for user information
const userSchema=new mongoose.Schema({  //mongoose.Schema is used to build constructor schema\
    // Schemas do not allow you to read and write from MongoDB, that's what models are for. But they do: Define what properties the documents you save in MongoDB
    //type is datatype and required means it must be entered by user
    name:{
        type:String,
        required:true
    },
    //unique defines unique values
    //createindexes create indexes for unique charactersitics
    //email always unique
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    //here required is not used, means it is false by default but a default value is given i.e. the javascirpt data.now function definition, it is not invoked. it will invoke when a schema is used to create user while filling data to it
    date:{
        type:Date,
        default:Date.now
    }
    
    
})
// creating model from schema and export 
const user=mongoose.model('user',userSchema)
// user.createIndexes() it is used to create indexes which can be used data redudancy
module.exports=user