import {React} from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import {useNavigate,useLocation, Link} from 'react-router-dom';
import './Login.css'
const Enroll=()=>{
    const location=useLocation();
    const navigate=useNavigate();
    const { mail, password } = location.state;
    const [subject,setsub]=useState([])
    const [enroll,setenroll]=useState([]);
    useEffect(()=>{
        const getData=async()=>{
           try{
            console.log(mail);
            const response=await axios.get("http://localhost:3002/subject",{
                params:{
                    mail:mail
                }});
             setsub(response.data);
             console.log(subject)
             console.log(response.data)
           }
           catch(err){
             console.log(err);
           }
        }
        getData();
    },[])
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get("http://localhost:3002/get_sub", {
                    params: {
                        mail: mail
                    }
                });
                setenroll(...enroll, response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [mail]);
    const isEnrolled = (subject,slot) => {
        console.log(subject)
       for(var i=0;i<enroll.length;i++){
          if(enroll[i].subject==subject && enroll[i].slot==slot)
              return true;
       }
       return false;
    }
    const submit1=async(teacher_id,subject,subject_id,teacher_name,slot,branch_name)=>{
        try{
            const l={teacher_id:teacher_id,subject:subject,teacher_name:teacher_name,branch_name:branch_name,slot:slot,mail:mail,subject_id:subject_id};
            const response=await axios.post("http://localhost:3002/enroll2",{list:l});
            alert(response.data);
        }
        catch(err){
            console.log(err);
        }
    }
    const withdraw=async(subject)=>{
        try{
           const response=await axios.post("http://localhost:3002/withdraw",{
                mail:mail,
                subject:subject
           })
           alert(response.data);
        }
        catch(err){

        }
    }
    return(
        <>
         <h1>enrollment page</h1>
         {
            subject.length!=0 &&
            <table style={{borderBlockColor:'black',border:'1',alignContent:'center'}}>
                <tr>
                    <td>subject</td>
                    <td>subject_id</td>
                    <td>teacher</td>
                    <td>slot</td>
                    <td>enroll</td>
                </tr>
               <tbody>
               {
                    subject.map((item)=>(
                       item.map((i)=>(
                        <tr>
                        <td>{i.subject}</td>
                        <td>{i.subject_id}</td>
                        <td>{i.teacher_name}</td>
                        <td>{i.slot}</td>
                        <td>
                           {
                            isEnrolled(i.subject,i.slot)?(
                                <button type='button' onClick={()=>withdraw(i.subject)}>withdraw</button>
                            ):(
                                <button type='button' onClick={() => submit1(i.teacher_id, i.subject,i.subject_id, i.teacher_name, i.slot, i.branch_name)}>Enroll</button>
                            )
                           }        
                        </td>
                    </tr>
                       ))
                    ))
                }
               </tbody>
            </table>
         }
         <button type='button' onClick={()=>navigate('/percent',{state:{mail:mail}})}>Show attendance log</button>
         <button type='button' onClick={()=>navigate('/course',{state:{enroll:enroll,mail:mail}})}>go to enrolled course</button>
        </>
    )
}

export default Enroll;