const express=require("express")
const app=express()
const bodyparser=require("body-parser")
const cors=require("cors")
const mysql=require("mysql")
const db=mysql.createConnection({
    host:"localhost",
    user:"student",
    password:"samo@2004",
    database:"info"
})

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors());
app.post("/register",(req,res)=>{
    const name=req.body.name;
    const mail=req.body.mail;
    const regno=req.body.regno;
    const password=req.body.password;
    const year=req.body.year;
    const branch=req.body.branch;
    console.log(name,mail,regno,password,year)
    var sql="select * from student where mail=? or reg=?";
    db.query(sql,[mail,regno],(err,result)=>{
        if(err) throw err;
        else if(result.length>0){
            res.send("student already exists");
        }
        else{
            var sql1="insert into student(name,mail,reg,year,password,branch_name) values(?,?,?,?,?,?)";
            db.query(sql1,[name,mail,regno,year,password,branch],(err,result)=>{
                if(err) throw err;
                else
                   res.send("successfully registered");
            })
        }
    })
  

})
app.get("/get",(req,res)=>{
    var mail=req.query.mail;
    var password=req.query.password;
   var sql="select s.subject_id,s.subject from teachers t inner join subjects s on s.subject_id=t.subject where t.mail=? and t.password=?";
   db.query(sql,[mail,password],(err,result)=>{
      if(err)
         res.send("error1");
      else
         res.send(result);
   })
})

app.post("/update", (req, res) => {
    const list = req.body.list;
    console.log(list);
    
    const curr_date = new Date();
    const year = curr_date.getFullYear();
    const month = String(curr_date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
    const date = String(curr_date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;

    const sqlDelete = "DELETE FROM attendance WHERE d = ? AND stud_reg = ? AND subject_id = ?";
    const sqlInsert = "INSERT INTO attendance (stud_reg, subject_id, branch_name, d, status) VALUES (?, ?, ?, ?, ?)";

    const updateAttendance = (entry) => {
        return new Promise((resolve, reject) => {
            db.query(sqlDelete, [formattedDate, entry.reg, entry.subject_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                db.query(sqlInsert, [entry.reg, entry.subject_id, entry.branch_name, formattedDate, entry.status], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
    };

    const updatePromises = list.map(entry => updateAttendance(entry));

    Promise.all(updatePromises)
        .then(() => {
            res.send("updated");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("error");
        });
});


app.get("/subject", (req, res) => {
    const mail = req.query.mail; 
    var list=[];
    console.log(mail);
    if (!mail) {
        return res.status(400).send("Mail parameter is missing");
    }

    var branch = "";
    var sql = `SELECT branch_name FROM student WHERE mail = '${mail}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching branch");
        }
        if (result.length === 0) {
            return res.status(404).send("Student not found");
        }
        branch = result[0].branch_name;

        var sql1 = "SELECT t.teacher_id, t.teacher_name, t.subject,s.subject,t.slot,t.branch_name,s.subject_id FROM teachers t INNER JOIN subjects s ON t.subject = s.subject_id WHERE t.branch_name = ? order by s.subject";
        db.query(sql1, [branch], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error fetching data");
            }
            if (result.length !== 0) {
                list.push(result);
            }
           // console.log(list); 
            res.send(list);
        });
    });
});

app.post("/enroll2", (req, res) => {
    var list = req.body.list;
    console.log(list);

    var sql = "SELECT stud_mail, subject_id FROM enrollement WHERE stud_mail=? AND subject_id=?";
    db.query(sql, [list.mail, list.subject_id], (err, result) => {
        if (err) {
            console.error("Error checking enrollment:", err);
            return res.status(500).send("Error");
        } else {
            console.log("Result:", result);
            if (result.length != 0) {
                return res.send(`Student already enrolled in subject ${list.subject}`);
            } else {
                var sql1 = "INSERT INTO enrollement(stud_mail, teacher_id, teacher_name, slot, subject,subject_id, branch_name) VALUES (?, ?, ?, ?, ?,?, ?)";
                db.query(sql1, [list.mail, list.teacher_id, list.teacher_name, list.slot, list.subject,list.subject_id, list.branch_name], (err, result) => {
                    if (err) {
                        console.error("Error enrolling student:", err);
                        return res.status(500).send("Error");
                    } else {
                        return res.send("Enrolled successfully");
                    }
                });
            }
        }
    });
});

app.get("/login",(req,res)=>{
    const mail=req.query.mail;
    const password=req.query.password;
    var sql="select * from student where mail=? and password=?";
    db.query(sql,[mail,password],(err,result)=>{
        if(err) throw err;
        else  if(result.length!=0){
            console.log("student");
            res.send("student")
        }
        else{
            var sql1="select * from teachers where mail=? and password=?";
            db.query(sql1,[mail,password],(err,result)=>{
                if(err)
                   res.send("error");
                else if(result.length!=0)
                   res.send("teacher");
                else
                   res.send("invalid login")
            })
        }
    })
})

app.get("/get_sub",(req,res)=>{
    const mail=req.query.mail;
   // console.log("m:"+mail);
    var sql="select subject,slot,subject_id from enrollement where stud_mail=?";
    db.query(sql,[mail],(err,result)=>{
        if(err)
           res.send("error");
        else
           res.send(result);
    })
})

app.get("/get_exams_name",(req,res)=>{
    var sql="select * from exams";
    db.query(sql,[],(err,result)=>{
        if(err)
             res.send("error");
        else
          res.send(result);
    })
})
app.get("/get_sub1",(req,res)=>{
    const mail=req.query.mail;
    var sql="select * from enrollement where stud_mail=?";
    db.query(sql,[mail],(err,result)=>{
        if(err)
           res.send("error");
        else
           res.send(result);
    })
})

app.post("/withdraw",(req,res)=>{
    const mail=req.body.mail;
    const subject=req.body.subject;
    console.log("mm"+mail);
    var sql="delete from enrollement where stud_mail=? and subject=?";
    db.query(sql,[mail,subject],(err,result)=>{
        if(err)
           res.send("error");
        else 
        {
            console.log(result);
           res.send("withdraw successfully");
        }
    })
})

app.get("/get_sub2", (req, res) => {
    const id = req.query.id;
    const subject = req.query.subject;
    console.log("Subject: " + subject); // Corrected typo here
    var sql = "SELECT * FROM student s inner join enrollement e on s.mail=e.stud_mail where e.subject=?";
    db.query(sql, [subject], (err, result) => {
        if (err) {
            res.send("error");
        } else {
            res.send(result);
        }
    });
});

app.get("/get_sub3",async(req,res)=>{
    const mail = req.query.mail;
    var sql="select s.reg,e.subject,e.subject_id from student s inner join enrollement e on s.mail=e.stud_mail where s.mail=?";
    db.query(sql,[mail],(err,result)=>{
        if(err)
            res.send("error");
        else
           res.send(result);
    })
})

app.get("/find_percent", (req, res) => {
    const { reg, subject_id } = req.query;
    var sql = "select * from attendance where stud_reg=? and subject_id=?";
    var cnt = 0;
    var tot_cnt=0;
    db.query(sql, [reg, subject_id], (err, result) => {
        if (err) {
            res.status(500).send("error");
        } else {
            for (var i = 0; i < result.length; i++) {
                console.log(result[i])
                if (result[i].status =='1')
                    cnt++;
                tot_cnt++;
            }
            res.send({ total:tot_cnt,percent: cnt }); 
        }
    });
});

app.get("/get_quiz",(req,res)=>{
    const {sub_id,subject,exam}=req.query;
    console.log(sub_id);
    var sql="select * from quiz where subject_id=? and exam_id=?";
    db.query(sql,[sub_id,exam],(err,result)=>{
        if(err)
             res.send("error");
        else
            res.send(result);
    })
})

app.post("/update_mark",(req,res)=>{
    const {mail,marks,sub_id,exam}=req.body;
    console.log(mail+" "+marks+" "+exam+" "+sub_id);
    var sql="insert into user_scores values(?,?,?,?)";
    var sql1="select reg from student where mail=?";
    db.query(sql1,[mail],(err,result)=>{
        if(err)
             res.send("error");
        else{
            console.log(result);
            db.query(sql,[result[0].reg,exam,sub_id,marks],(err,result)=>{
                if(err)
                     res.send("error");
                else 
                   res.send("updated successfully");
            })
        }
    })
})

app.get("/check",(req,res)=>{
    const{mail}=req.query;
    //console.log(mail);
    var sql="select reg from student where mail=?";
    db.query(sql,[mail],(err,result)=>{
        if(err)
             res.send("error");
        else{
            var sql1="select * from user_scores where reg=?";
            db.query(sql1,[result[0].reg],(err,result1)=>{
                //console.log(result1);
                if(err)
                     res.send("error");
                else if(result1.length!=0)
                    {
                    console.log("true"+result1);
                    res.send("true");
                    }
                else
                {
                    console.log("false");
                   res.send("false");
                }
            })
        }
    })
})

app.get("/get_marks",(req,res)=>{
    const{mail,id,exam}=req.query;
    var sql="select reg from student where mail=?";
    db.query(sql,[mail],(err,result)=>{
        if(err)
             res.send("error");
        else{
            var sql1="select tot_marks from user_scores where reg=? and exam_id=? and subject_id=?";
            db.query(sql1,[result[0].reg,exam,id],(err,result1)=>{
                //console.log(result1);
                if(err)
                     res.send("error");
                else if(result1.length!=0){
                    console.log(result1);
                    res.status(200).send(result1[0].tot_marks.toString());
                }
                else{
                    res.send("0");
                }
            })
        }
    })
})
app.listen(3002,()=>{
    console.log("listen on 3002")
})