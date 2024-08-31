import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuest] = useState([]);
  const [marks, setMarks] = useState(0);
  const { id, subject, exam, start_date, end_date, mail } = location.state;
  const d1 = new Date(start_date);
  const start_date_formatted = d1.getDate();
  const d2 = new Date(end_date);
  const end_date_formatted = d2.getDate();
  const date = new Date();
  const curr_date = date.getDate();

  const list = {};

  useEffect(() => {
    const getData = async () => {
      try {
        const response1 = await axios.get("http://localhost:3002/check", {
          params: {
            mail: mail
          }
        });
        console.log("Response from /check:", response1.data);

        if (response1.data === false) {
          const response = await axios.get("http://localhost:3002/get_quiz", {
            params: {
              sub_id: id,
              subject: subject,
              exam: exam,
            }
          });
          console.log("Quiz data:", response.data + " " + start_date + " " + end_date_formatted);
          setQuest(response.data);
          console.log("Updated questions:", questions);
        } else if (response1.data === true) {
          console.log("User has already attended the quiz.");
          const response = await axios.get("http://localhost:3002/get_marks", {
            params: {
              mail: mail,
              id: id,
              exam: exam
            }
          });
          setMarks(response.data);
          console.log(response.data);

        } else {
          console.log("Unexpected response:", response1.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const update = (question_text, select_ans, correct_answer) => {
    list[question_text] = select_ans;
  }

  const submit = async () => {
    let tot_marks = 0;
    let allans = true;

    for (let i = 0; i < questions.length; i++) {
      if (!(questions[i].question_text in list)) {
        allans = false;
        break;
      }
    }

    if (!allans) {
      alert("All questions must be answered");
    } else {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].correct_answer === list[questions[i].question_text])
          tot_marks++;
      }
      //alert("Marks: " + tot_marks+" "+exam);
    }
    setMarks(tot_marks);
    await axios.post("http://localhost:3002/update_mark", {
      mail: mail,
      marks: tot_marks,
      exam: exam,
      sub_id: id
    });
  }

  const generateCertificate = async (mail, marks) => {
    var txt="";
    if(exam==1)
      txt="CAT-1";
    else if(exam==2)
        txt="CAT-2";
    else if(exam==3)
      txt="TERMINAL EXAM";
    const qrCodeData = `Mail: ${mail}, Marks: ${marks}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);
  
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
  
    // Add a colored navbar
    page.drawRectangle({
      x: 0,
      y: 380,
      width: 600,
      height:600,
      color: rgb(0.1, 0.2, 0.7), // Adjust the color as needed
    });
  
    // Embed and draw the logo
    const logoUrl = '/th.png'; // Update this to the actual path of your logo
    const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
  
    page.drawImage(logoImage, {
      x: 10,
      y: 350,
      width: 50,
      height: 50,
    });
  
    page.drawText('Certificate of Completion', {
      x: 80,
      y: 350,
      size: 30,
      color: rgb(0, 0, 0),
    });
  
    page.drawText(`This certificate is awarded to`, {
      x: 50,
      y: 300,
      size: 20,
      color: rgb(0, 0, 0),
    });
  
    page.drawText(mail, {
      x: 50,
      y: 270,
      size: 20,
      color: rgb(0, 0, 1),
    });
  
    page.drawText(`for scoring ${marks} marks in ${txt}.`, {
      x: 50,
      y: 240,
      size: 20,
      color: rgb(0, 0, 0),
    });
  
    const qrImage = await pdfDoc.embedPng(qrCode);
    page.drawImage(qrImage, {
      x: 400,
      y: 200,
      width: 150,
      height: 150,
    });
  
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `${mail}_${txt}_${subject}.pdf`);
  }
  

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <script src='https://kit.fontawesome.com/a076d05399.js' crossOrigin='anonymous' />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </Helmet>
      <div style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '20px' }}>
        <h1>Quiz page</h1>
        <br></br><br></br>
        {
          curr_date >= start_date_formatted && curr_date <= end_date_formatted && questions.map((ques, index) => (
            <ul key={index} style={{ listStyle: 'none' }}>
              <li>{index + 1}. {ques.question_text}</li>
              <div>
                <label>
                  <input type='radio' name={ques.question_text} value={ques.option1} onChange={(e) => update(ques.question_text, ques.option1)} />
                  a. {ques.option1}</label>
                <br></br>
              </div>
              <div>
                <label>
                  <input type='radio' name={ques.question_text} value={ques.option2} onChange={(e) => update(ques.question_text, ques.option2)} />
                  b. {ques.option2}</label>
              </div>
              <div>
                <label>
                  <input type='radio' name={ques.question_text} value={ques.option3} onChange={(e) => update(ques.question_text, ques.option3)} />
                  c. {ques.option3}</label>
              </div>
              <div>
                <label>
                  <input type='radio' name={ques.question_text} value={ques.option4} onChange={(e) => update(ques.question_text, ques.option4)} />
                  d. {ques.option4}</label>
              </div>
              <br></br>
              <button type='button' className="btn btn-primary" onClick={submit}>Submit</button>
              <br></br>
            </ul>
          ))
        }
        {
          curr_date < start_date && curr_date > end_date && <h1>quiz has been finished</h1>
        }
        {
          curr_date >= start_date && curr_date <= end_date && marks !== 0 && questions.length === 0 && <h1>quiz has been already attended</h1>
        }
        {
          marks === 0 && questions.length === 0 && <h1>quiz has been not published</h1>
        }
        <br></br>
        <h1>Marks obtained: {marks}</h1>
        {
          marks>0 && <button type='button' class="btn btn-success" onClick={()=>generateCertificate(mail,marks)}>click to download the certificate</button>
        }
      </div>
    </>
  )
}

export default Quiz;
