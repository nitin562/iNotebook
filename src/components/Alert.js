import React,{useEffect} from 'react'
import './alert.css'
export default function Alert(props) {
  return (
    <>
    <div className="alert">
        <p>{props.Status}:{props.description}</p>
    </div>
    </>
  )
}
