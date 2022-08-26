import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import Mid from './mid';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
// import '../node_modules/react-bootstrap/dist/'
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <BrowserRouter>
    <Mid />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
