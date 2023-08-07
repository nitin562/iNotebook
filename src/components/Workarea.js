import React, { useContext, useEffect, useState } from "react";
import "./workarea.css";
import contextMenu from "../context/ContextSnip";
import {useNavigate } from "react-router-dom";
import Titlenote from "./Titlenote";
// import Alert from "./Alert";
export default function Workarea() {
  const globalstate = useContext(contextMenu);
  const navigate = useNavigate();
  const [TextObj, setTextObj] = useState({"desc":"","title":"","tag":""})
  const [Clicked, setClicked] = useState(-1)
  const [operation,setOperation]=useState("")
  
  const fetchData=async()=>{
    let token=localStorage.getItem("token")
    const options={
      method:'GET',
      headers:{
        'auth-token':token
      }
    }
    let result=await fetch('http://localhost:5000/api/notes/getNotes',options)
    let jsonResult=await result.json()
    if(jsonResult.Success===1){
      globalstate.update({notes:jsonResult.Notes})

    }
    else{
      setOperation('Fetching: Unsuccessful')
      setTimeout(()=>{
        setOperation("")
      },1500)
    }
  }
  useEffect(()=>{ //ComponentDidMount
    if(globalstate.state.login){
      fetchData()
    }
  },[])
  useEffect(()=>{  //ComponentDidUpdate- When click on noteItem then all data from data will display to note section area
    if(Clicked===-1){
      return
    }
    const noteItem=globalstate.state.notes[Clicked]
    const DisplayData={
      title:noteItem.title,
      desc:noteItem.desc,
      tag:noteItem.tag
    }
    setTextObj(DisplayData)
    
    // for checking delete should enable or disable
  },[Clicked])
  
  // Functions for buttons
  const HandleChange=(e)=>{
    if(e.target.id==='title'){
      setTextObj({...TextObj,title:e.target.value})
    }
    else if(e.target.id==='note'){
      setTextObj({...TextObj,desc:e.target.value})

    }
    else{
      setTextObj({...TextObj,tag:e.target.value})

    }
  }
  const DoOperation=async(url,Method,header,ShouldBody,process_name,SentBody={})=>{
    const options={
      method:Method,
      headers:header,
    }
    if(ShouldBody){
      options.body=JSON.stringify(SentBody)
    }
    const result=await fetch(url,options)
    const jsonResult=await result.json()
    if(jsonResult.Success===1){
      fetchData()
      setOperation(`${process_name}:Successfull`)
    }
    else{
      setOperation(`${process_name}:Not Successfull`)
    }
    setTimeout(()=>{
      setOperation("")
    },1000)
  }
  const Clear=()=>{
    setTextObj({title:"",desc:"",tag:""})
    setClicked(-1)
  }
  const Save=async()=>{
    const url="http://localhost:5000/api/notes/addnote"
    const header={
      "auth-token":localStorage.getItem("token"),
      "Content-Type":"application/json"
    }
    await DoOperation(url,"POST",header,true,"Saving",TextObj)
      
    }
  
  //Update
  const Update=async()=>{
    const id=globalstate.state.notes[Clicked]._id
    const url="http://localhost:5000/api/notes/updatenote/"+id
    
    const header={
      'auth-token':localStorage.getItem("token"),
      'Content-Type':"application/json"
    }
    await DoOperation(url,"PUT",header,true,"Updation",TextObj)
  }
  //DeleteAll
  const DeleteAll=async()=>{
    if(globalstate.state.notes.length===0){
      setOperation("No notes to Delete")
      setTimeout(()=>{
        setOperation("")
      },1000)
      return;
    }
    const url="http://localhost:5000/api/notes/deleteAll"
    const header={
      'auth-token':localStorage.getItem('token')
    }
    await DoOperation(url,"DELETE",header,false,"Deleting ALL")
  }
  // ---------
  return (
    <div className="workContainer">
      
      <div className="Creation scrollbar">
        <div className="wrap">
          <label htmlFor="title">
            <p>Create Note</p>
          </label>

          <div className="titleHandle">
            <img src={require("../Images/title.png")} />
            <input type="text" id="title" placeholder="Enter Title of Note" onChange={HandleChange} value={TextObj.title} />
          <input type="text" id="tag" placeholder="Enter tag (Optional)" value={TextObj.tag} onChange={HandleChange}/>

          </div>
        </div>

        <textarea
          name="note"
          id="note"
          cols="30"
          rows="10"
          placeholder="Enter note here"
          value={TextObj.desc}
          onChange={HandleChange}
        ></textarea>
        <div className="btnPanel">
          <button id="Clear" onClick={Clear}>Clear</button>
          <button id="Save" disabled={!globalstate.state.login} onClick={Save}>
            Save
          </button>
          <button id="Update" disabled={Clicked===-1} onClick={Update}>Update</button>

         
        </div>
      </div>
      <div className="collection">
        <div id="top">
          <p>Your Notes</p>
          <button className="LoginBtn"><img src={require('../Images/DeleteAll.png')} onClick={DeleteAll} /></button>
        </div>
        {!globalstate.state.login && (
          <div className="NotLogined">
            <button
              className="LoginBtn"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        )}
       { globalstate.state.login&&<div className="AllNotes scrollbar">
              {globalstate.state.notes.map((element,index)=>{
                return <Titlenote key={element._id} id={element._id} changeClicked={setClicked} pos={index} title={element.title} date={element.date} tag={element.tag} StateDelete={setOperation}/>
              }).reverse()}
        </div>}
        {globalstate.state.login&&<div className="CountNotes">
          <p>{operation}</p>
          <p>Notes:  <span>{globalstate.state.notes.length}</span></p>
        </div>}
      </div>
    </div>
  );
}
