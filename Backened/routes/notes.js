const express = require("express");
const fetchdata = require("../middleware/fetchdata"); //middleware
const Note = require("../models/NotesSchema"); //note schema
const router = express.Router();
const { check, validationResult } = require("express-validator"); //Validation mechanism

//enpoint:1 for fetching all notes- /getNotes
//login is required
router.get("/getNotes", fetchdata, async (req, res) => {
  try {
    const userID = req.user.id;
    const Notes = await Note.find({ user: userID });
    
    res.json({Success:1,Notes});
  } catch (err) {
    res.status(500).json({ Success:0,message: "Internal error occurred", error: err });
  }
});
//endpoint2 for adding a note- /addnote
router.post(
  "/addnote",
  fetchdata,
  [check("title").isLength({ min: 3 }), check("desc").isLength({ min: 3 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(402)
        .json({Success:0, msg: "Error occurred", error: errors.mapped() });
    }
    try {
      const { title, desc, tag, date } = req.body;
      const userId = req.user.id;
      const note = new Note({ title, desc, tag, date, user: userId });
      await note.save();
      res.status(200).json({Success:1,note});
    } catch (err) {
      res.status(500).json({Success:0, msg: "Internal error occured", error: err });
    }
  }
);

//endpoint-3 for updating a note- /updatenote
router.put("/updatenote/:id", fetchdata, async (req, res) => {
  try {
    const { title, desc, tag } = req.body; //desructurized
    const noteId = req.params.id; // id of note that is given to url
    const userId = req.user.id; // id of user from token
    let newNote = {}; // creating new note
    if (title) newNote.title = title; // inserting  information if given to body
    if (desc) newNote.desc = desc;
    if (tag) newNote.tag = tag;
    // find the note with noteId
    let note = await Note.findById(noteId);
    //verifying the updation is ethical
    if (!note) {
      //if note is not present
      return res.status(401).json({Success:0,msg:"Note is not found"});
    }
    if (note.user.toString() !== userId) {
      // user is not owner of that note
      return res.status(401).json({Success:1,msg:"please authenticate user's token"});
    }
    note = await Note.findByIdAndUpdate(
      // updating note
      noteId, // id
      { $set: newNote }, // to updated note
      { new: true } // it means if modified value of note is present then modify
    );
    res.json({Success:1,note });
  } catch (error) {
    res.status(500).json({Success:0, error });
  }
});

// endpoint-4 for delete a note - /deletenote/:id
router.delete("/deletenote/:id", fetchdata, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    //verify the user
    let note = await Note.findById(noteId);
    if (!note) {
      return res
        .status(402)
        .json({Success:0,msg:"No note is present associated with given id"});
    }
    if (note.user.toString() !== userId) {
      return res.status(402).send("Please Authenticate the given token");
    }
    //verified
    note = await Note.findByIdAndDelete(noteId);
    res.json({Success:1,"msg":"Note has been deleted",note:note});
  } catch (error) {
    res.status(500).json({Success:0,error})
  }
});
// endpoint for delete all notes of user: /deleteAll
router.delete('/deleteAll',fetchdata,async(req,res)=>{
  try {
    const userId=req.user.id
    let notes=await Note.find({user:userId})
    if(notes.length===0){
      return res.json({Success:0,msg:"No notes are found to delete"})
    }
    await Note.deleteMany({user:userId})
    res.json({Success:1,notes})

  } catch (error) {
    res.status(500).json({Success:0,error})
  }
  
})

module.exports = router;
