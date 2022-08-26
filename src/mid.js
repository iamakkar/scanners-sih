import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Routes, Link } from "react-router-dom";
import { useParams } from "react-router";
import App from './App'; 
import Login from "./Login";
import Main from './Main';
import Documents from './Documents';
import FolderRender from './FolderRender';

function mid(){

    return (<div>
    <Routes>
        <Route exact path="/main/upload/:id" element={<App />} />
        <Route exact path="/" element={<Login />} />
        <Route exact path="/main/docs/:id" element={<Documents />} />
        <Route exact path="/main/:id" element={<Main />} />
        <Route exact path="/main/docs/folder" element={<FolderRender />} />
    </Routes>
  </div>);
}

export default mid;