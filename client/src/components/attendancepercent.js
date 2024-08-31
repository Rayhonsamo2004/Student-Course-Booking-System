import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Attendancepercent.css';

const Attendancepercent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mail } = location.state;
    const [sub_id, setSub_id] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get("http://localhost:3002/get_sub3", {
                    params: { mail: mail }
                });
                const data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const response1 = await axios.get("http://localhost:3002/find_percent", {
                        params: {
                            reg: data[i].reg,
                            subject_id: data[i].subject_id
                        }
                    });
                    data[i].percent = (response1.data.percent / response1.data.total) * 100;
                    data[i].total = response1.data.total;
                    data[i].present=response1.data.percent;
                }
                console.log(data);
                setSub_id(data);
                if (data.length > 0) {
                    setSelectedSubject(data[0].subject_id);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, [mail]);

    return (
        <div>
            <div className="dashboard">
                <div className="dropdown">
                    <label htmlFor="subject">Select Subject: </label>
                    <select id="subject" onChange={(e) =>setSelectedSubject(e.target.value)} value={selectedSubject}>
                        {sub_id.map((item, index) => (
                            <option key={index} value={item.subject_id}>{item.subject}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="table-container">
                <h1>Attendance Log</h1>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Subject ID</th>
                            <th>Total Classes</th>
                            <th>present Classes</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sub_id.filter(item => item.subject_id === parseInt(selectedSubject)).map((item, index) => (
                            <tr key={index}>
                                <td>{item.subject}</td>
                                <td>{item.subject_id}</td>
                                <td>{item.total}</td>
                                <td>{item.present}</td>
                                <td>{item.percent}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Attendancepercent;
