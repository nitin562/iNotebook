import React, { useContext } from "react";
import "./titleNote.css";
import contextMenu from "../context/ContextSnip";

export default function Titlenote(props) {
  const { title, date, pos, changeClicked, tag,id } = props;
  const globalstate=useContext(contextMenu)
  const returnDate = (d) => {
    const dt = new Date(d);
    let dayRest = dt.getDate() < 10 ? "0" : "";
    let MonthRest = dt.getMonth() < 10 ? "0" : "";
    return `${dayRest}${dt.getDate()}-${MonthRest}${dt.getMonth()}-${dt.getFullYear()}`;
  };
  const Clicked = () => {
    changeClicked(pos);
  };
  const deleteNote=async()=>{
    const url="http://localhost:5000/api/notes/deletenote/"+id
    let Token=localStorage.getItem("token")
    const options={
      method:'DELETE',
      headers:{
        'auth-token':Token
      }
    }

    const result=await fetch(url,options)
    const jsonResult=await result.json()
    if(jsonResult.Success===1){
      let newNoteArr=[...globalstate.state.notes.slice(0,pos),...globalstate.state.notes.slice(pos+1)];

      props.StateDelete("Deletion:SuccessFul")

      globalstate.update({notes:newNoteArr}) 
    }
    else{

      props.StateDelete("Deletion:Not SuccessFul")
    }
    setTimeout(()=>{
      props.StateDelete("")
    },1000)
  }
  return (
    <>
      <p id="docTag">{tag}</p>
      <div className="Titlenotes" onClick={Clicked}>
        <img src={require("../Images/NoteIcon.png")} />
        <div className="info">
          <p id="note_title">
            {title.length > 15 ? title.slice(0, 9) + "..." : title}
          </p>
          <button id="DeleteBtn" onClick={deleteNote}><img src={require('../Images/delete.png')} alt="Delete" title="Delete note"/></button>
          <p id="date">{returnDate(date)}</p>
         
        </div>
       
        
      </div>
    </>
  );
}
