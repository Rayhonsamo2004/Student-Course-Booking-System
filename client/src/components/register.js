import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [regno, setReg] = useState("");
  const [year, setYear] = useState(0);
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (name && mail && regno && year && password && branch) {
      if (mail.indexOf("@student.tce.edu") !== -1) {
        try {
          const response = await axios.post("http://localhost:3002/register", { name, mail, regno, password, year, branch });
          alert(response.data);
        } catch (err) {
          console.log(err);
        }
      } else {
        alert("Register with student mail ID");
      }
    } else {
      alert("Fill all the fields");
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="navbar">Register Page</div>
        <h1>Register</h1>
        <form onSubmit={submit}>
          <input type="text" name="name" onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
          <input type="email" name="mail" onChange={(e) => setMail(e.target.value)} placeholder="Enter mail" />
          <input type="text" name="reg" onChange={(e) => setReg(e.target.value)} placeholder="Enter regno" />
          <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          <select onChange={(e) => setYear(e.target.value)}>
            <option value="">Select year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          <select onChange={(e) => setBranch(e.target.value)}>
            <option value="">Select branch</option>
            <option value="IT">IT</option>
            <option value="CSE">CSE</option>
            <option value="MECH">MECH</option>
            <option value="EEE">EEE</option>
            <option value="ECE">ECE</option>
          </select>
          <input type="submit" value="Register" />
        </form>
        <Link to="/login" className="link">Login</Link>
      </div>
    </div>
  );
};

export default Register;
