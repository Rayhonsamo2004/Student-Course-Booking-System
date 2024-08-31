import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Attendance from './components/attendance'
import Enroll from './components/enrollment';
import Course from './components/course';
import Attendancepercent from './components/attendancepercent';
import Quiz from './components/quiz';
function App() {

  return (
   <>
   <Router>
    <Routes>
      <Route path='/' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/attendance' element={<Attendance/>}/>
      <Route path='/enroll' element={<Enroll/>}/>
      <Route path='/course' element={<Course/>}/>
      <Route path='/percent' element={<Attendancepercent/>}/>
      <Route path='/quiz' element={<Quiz/>}/>
    </Routes>
   </Router>
   </>
  );
}

export default App;
