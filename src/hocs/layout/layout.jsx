import React, { useState } from "react";
import Navbar from "../../components/navbar";
import SideBar from "../../components/sideBar";
import "./layout.css";
export default function Layout(props) {
  const checkLocalStore = () => {
    let localStore = localStorage.getItem("reSize");
    if(!localStore){
     return false;
    }else{
      if(localStore === "true"){
        return true;
      }
      return false;
    }
  }
  const [resize, setResize] = useState(checkLocalStore());
  const onHandleResize = () => {
   
    localStorage.setItem("reSize",!resize);
    setResize(!resize);
  };
  

  return (
   
    <div>
      
      <div className="navbar">
        <Navbar></Navbar>
      </div>
      <div className="content-components">
        {resize ? (
          <>
            <div className="sidebar-component sidebar-resize">
              <SideBar onHandleResize={onHandleResize}></SideBar>
            </div>
            <div className="children-component sidebar-resize">{props.children}</div>
          </>
        ) : (
          <>
            <div className="sidebar-component">
              <SideBar onHandleResize={onHandleResize}></SideBar>
            </div>
            <div className="children-component">{props.children}</div>
          </>
        )}
      </div>
    </div>
  );
}
