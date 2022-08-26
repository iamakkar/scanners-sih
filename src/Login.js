import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {auth} from './Config/Firebase';
import { useUserAuth } from "./Context/UserAuthContext";
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import ReactLoading from "react-loading";
// import "./bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [load, setLoad] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // try {
        console.log(email);
        console.log(password);
        setLoad(true)
        signInWithEmailAndPassword(auth, email, password).then(()=> {
            console.log('here');
            onAuthStateChanged(auth, (currentuser) => {
                // console.log(currentuser.uid);
                setLoad(false)
                navigate("/main/"+currentuser.uid);
            });
        })
        .catch((error)=>{
            console.log('not valid');
        })
  };


  return (
      <div className="p-4 box" style={{width:'70%', margin:'10% auto'}}>
        <h2 className="mb-3">Login</h2>
        <br />
        {error && <Alert variant="danger">{error}</Alert>}
        { load ? 
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
          <ReactLoading type="spinningBubbles" color='black' /> 
          </div>
        :
          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Log In
            </Button>
          </div>
        </Form>
        }
      </div>
  );
};

export default Login;




