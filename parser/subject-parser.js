var os=require('os')
var Subject=require('../model/Subject')
var fs=require('fs')
var subjectsList={};
module.exports=(subjectsArray)=>{
    subjectsArray.forEach(subjects=>{
        subjects=subjects.split(os.EOL).filter((subject)=>(!(/^(S\.No\.)|(RESULT)/.test(subject)||(/^\f/.test(subject)))));
        subjects.forEach((subject)=>{
            let paperId,paperCode,passMarks,maxMarks,major,minor,kind,mode,exam,type,credits,name;
            subject=subject.split(' ');
            subject.shift();
            paperId=subject.shift();
            paperCode=subject.shift();
            passMarks=subject.pop();
            maxMarks=subject.pop();
            major=subject.pop();
            minor=subject.pop();
            kind=subject.pop();
            mode=subject.pop();
            exam=subject.pop();
            type=subject.pop();
            credits=subject.pop();
            name=subject.join(' ').replace(/[^\x00-\x7F]/g, "-");
            var obj=new Subject(paperId,paperCode,passMarks,maxMarks,major,minor,kind,mode,exam,type,credits,name);
            subjectsList[obj.paperId]=obj;
        })
    });
    subjectsList=Object.values(subjectsList);
    return subjectsList;
};