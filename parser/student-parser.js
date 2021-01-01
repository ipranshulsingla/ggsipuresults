var os=require('os');
var Student=require('../model/Student');
var Paper=require('../model/Paper');
var Semester=require('../model/Semester');
var fs=require('fs');
var regexForStudent=null;
if(os.platform=='linux'){
    regexForStudent=/\b\d{11}\n([^]*?)SchemeID:(.+)\n(\d+[(\d)]+\n[\w-]+\s[\w-]+\n.+\n)+\d+/g;
}
else{
    regexForStudent=/\b\d{11}\r\n([^]*?)SchemeID:(.+)\r\n(\d+[(\d)]+\r\n[\w-]+\s[\w-]+\r\n.+\r\n)+\d+/g;
}
var studentsResult={};
module.exports=(resultPages)=>{
    studentsResult={freshResult:[],reappearResult:[]}
    resultPages.forEach((eachPage)=>{
        let genDetails=getGeneralDetails(eachPage);
        let students=eachPage.match(regexForStudent);
        students.forEach((student)=>{
            student=student.split(os.EOL);
            var obj=new Student();
            obj.batch=genDetails.batch;
            obj.institute=genDetails.institute;
            obj.institutionCode=genDetails.instcode;
            obj.programme=genDetails.programme;
            obj.enrollmentNo=student.shift().trim();
            obj.name=student.shift();
            student.shift();
            student.shift();
            let semObj=new Semester();
            semObj.semester=genDetails.semester;
            semObj.papers=[];
            semObj.creditsSecured=student.pop().trim();
            let paperObj=[];
            for(let i=0;i<student.length;i+=3){
                let paper=new Paper();
                let t;
                paper.paperId=student[i].split('(').shift();
                t=student[i+1].split(' ');
                paper.internal=t[0];
                paper.external=t[1];
                t=student[i+2];
                if(t.match(/[0-9A-Z()\s+]+/)){
                    let total=(t.match(/\d\d?\d?/)+'');
                    paper.total=total=='null'?'0':total;
                    paper.grade=t.match(/[^0-9()]+/)+'';
                }
                else if(t.match(/[^A-Z()]+/)){
                    paper.total=t=='null'?'0':t;
                    paper.grade='NA';
                }
                else{
                    paper.total='0';
                    paper.grade=t;
                }
                paperObj.push(paper);
            }
            semObj.papers=paperObj;
            obj.semesters=[];
            obj.semesters.push(semObj);
            if(genDetails.examination.startsWith('REGULAR')){
                studentsResult.freshResult.push(obj);
                // console.log(genDetails.examination);
            }
            else{
                // console.log(genDetails.examination);
                studentsResult.reappearResult.push(obj);
            }
        });
    });
    return studentsResult;
}

function getGeneralDetails(eachPage){
    let obj={};
    let programme=eachPage.match(/Programme\sName:\s([^]*?\s)Sem/)[0].split(' ');
    programme.pop();
    programme.shift();
    programme.shift();
    programme=programme.join(' ');
    obj['programme']=programme.trim();
    let t=eachPage.match(/Batch:([^]*?\n)/)[0].split(':');
    t.shift();
    let examination=t.pop();
    let batch=t[0].split(' ');
    batch.pop();
    batch=batch.pop();
    obj['examination']=examination.trim();
    obj['batch']=batch.trim();
    t=eachPage.match(/Institution\sCode:\s([^]*?\n)/)[0].split(':');
    t.shift();
    let institute=t.pop();
    let instCode=t[0].split(' ');
    instCode.pop();
    instCode=instCode.pop();
    obj['institute']=institute.trim();
    obj['instcode']=instCode.trim();
    t=eachPage.match(/Sem.\/Year:([^]*?\d+)/)[0].split(':');
    let semester=t.pop();
    obj['semester']=semester.trim();
    return obj;
}