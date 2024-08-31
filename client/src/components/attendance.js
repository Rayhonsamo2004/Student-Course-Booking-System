import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Attendance = () => {
    const location = useLocation();
    const { mail, password } = location.state;
    const [users, setUsers] = useState([]); 
    const [subjects, setSubjects] = useState([]); // Changed variable name to subjects
    useEffect(() => {
        const getData = async () => {
            try {
                console.log(mail);
                const response = await axios.get("http://localhost:3002/get", {
                    params: {
                        mail: mail,
                        password: password
                    }
                });
                const data = response.data;
                console.log(response.data);
                setSubjects(data);
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [mail]); 

    const navigate = useNavigate();

    const update = (index) => {
        const updatedUsers = [...users]; 
        updatedUsers[index].status = !updatedUsers[index].status; 
        setUsers(updatedUsers); 
    }

    const submit = async () => {
        try {
            const response = await axios.post("http://localhost:3002/update", { list: users });
            console.log(users);
            if (response.data === "updated")
                alert("Updated successfully");
            else 
                alert("Not updated successfully");
        } catch (err) {
            console.log(err);
        }
    }

    const getsub = async (subject,id) => {
        try {
            console.log(subject)
            const response = await axios.get("http://localhost:3002/get_sub2",{
                  params:{
                    id:id,
                    subject:subject
                  }
            });
            console.log(response.data);
            const newData = response.data.map(item => ({ name: item.name, mail: item.mail, reg:item.reg,branch_name:item.branch_name,
                subject_id:item.subject_id,

                status: true }));
            setUsers(newData);            
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <h1>Attendance page</h1>
            <h1>Subjects:</h1>
            <ul>
                {subjects.map((subject, index) => (
                   <button type='button' onClick={()=>getsub(subject.subject,subject.subject_id)}>{subject.subject}</button>
                ))}
            </ul>
            {users.length !== 0 &&
                <table border="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Mail</th>
                            <th>regno</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.mail}</td>
                                <td>{user.reg}</td>
                                <td>
                                    <button type='button' onClick={() => update(index)}>
                                        {user.status ? "Present" : "Absent"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            <button type='button' onClick={()=>submit()}>submit</button>
        </>
    )
}

export default Attendance;
