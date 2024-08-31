import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      if (mail !== "" && password !== "") {
        const response = await axios.get("http://localhost:3002/login", {
          params: {
            mail: mail,
            password: password
          }
        });

        if (response.data.length !== 0 && response.data === 'student') {
          alert("Successful login");
          navigate("/enroll", {
            state: {
              mail: mail,
              password: password
            }
          });
        } else if (response.data.length !== 0 && response.data === 'teacher') {
          alert("Successful login");
          navigate("/attendance", {
            state: {
              mail: mail,
              password: password
            }
          });
        } else if (response.data.length === 0) {
          alert("Invalid credentials");
        }
      } else {
        alert("Fill all fields");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h1>Login page</h1>
        <input type='email' name='mail' onChange={(e) => setMail(e.target.value)} placeholder='Enter mail' />
        <input type='password' name='password' onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' />
        <input type='submit' value="Login" onClick={submit} />
      </div>
    </div>
  );
}

export default Login;
