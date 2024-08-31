import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Course = () => {
    const location = useLocation();
    const navigate=useNavigate();
    const { enroll,mail } = location.state;
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [start_dates,set_start]=useState([]);
    const [end_dates,set_end]=useState([]);
    useEffect(() => {
        console.log(mail)
        const fetchData = async () => {
            try {
                const examsResponse = await axios.get("http://localhost:3002/get_exams_name");
                setExams(examsResponse.data);
                console.log(exams);
                const d=[];
                for(var i=0;i<exams.length;i++){
                    d.push(exams[i].start_date);
                }
                set_start(d);
                const end=[];
                for(var i=0;i<exams.length;i++){
                    end.push(exams[i].end_date);
                }
                set_end(end);
                console.log(start_dates);
                console.log(end_dates);
                if (enroll) {
                    setSubjects(enroll);
                }
               // console.log(subjects);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }); 

    return (
        <table>
            <thead>
                <tr>
                    <td rowSpan={2}>Exams</td>
                    {exams.map((exam, index1) => (
                        <td key={index1}>{exam.exam_name}</td>
                    ))}
                </tr>
            </thead>
            <tbody>

                    {subjects.map((subject, index) => (
                       <tr>
                          <td>{subject.subject}</td>
                          <td>
                            <button type='button' onClick={()=>navigate('/quiz',{state:{id:subject.subject_id,subject:subject.subject,exam:1,start_date:start_dates[index],end_date:end_dates[index],mail:mail}})}>Link</button>
                          </td>
                          <td>
                            <button type='button' onClick={()=>navigate('/quiz',{state:{id:subject.subject_id,subject:subject.subject,exam:2,start_date:start_dates[index],end_date:end_dates[index],mail:mail}})}>Link</button>
                          </td>
                          <td>
                            <button type='button' onClick={()=>navigate('/quiz',{state:{id:subject.subject_id,subject:subject.subject,exam:3,start_date:start_dates[index],end_date:end_dates[index],mail:mail}})}>Link</button>
                          </td>
                       </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default Course;
