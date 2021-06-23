var database=require('../database')

const gradePointCalc=(marks)=>{
    let gradePoint=0;
    if(marks>=90)
        gradePoint=10;
    else if(marks>=75)
        gradePoint=9;
    else if(marks>=65)
        gradePoint=8;
    else if(marks>=55)
        gradePoint=7;
    else if(marks>=50)
        gradePoint=6;
    else if(marks>=45)
        gradePoint=5;
    else if(marks>=40)
        gradePoint=4;
    return gradePoint;
};

module.exports.prepareFullResult=(result)=>{
    let semesters=result.semesters;
    let cgpa=0,totalCredits=0,backlogs=0;
    semesters.forEach(semester=>{
        let sgpa=0;
        semester.papers.forEach(paper=>{
            let subject=database.getSubject(paper.paperId);
            paper.paperCode=subject.paperCode;
            paper.name=subject.name;
            let credits=parseInt(subject.credits);
            let total=isNaN(parseInt(paper.total))?0:parseInt(paper.total);
            let gradePoint=gradePointCalc(total);
            if(parseInt(subject.passMarks)>total)
                ++backlogs;
            sgpa+=(credits*gradePoint);
            totalCredits+=credits;
        });
        cgpa+=sgpa;
    });
    cgpa=(cgpa/totalCredits).toFixed(2);
    let percentage=cgpa*10;
    result.semesters=semesters;
    result.percentage=percentage.toFixed(2);
    result.cgpa=cgpa;
    result.backlogs=backlogs;
    return result;
};

module.exports.rankCalc=(searchResult)=>{
    var collegeRank=1,universityRank=1;
    database.results.forEach(opponent=>{
        opponent=this.prepareFullResult(opponent);
        if(searchResult.programme.trim()===opponent.programme.trim() && searchResult.batch.trim()===opponent.batch.trim() && searchResult.enrollmentNo.trim()!=opponent.enrollmentNo.trim()&&searchResult.semesters.length===opponent.semesters.length){
            if((parseInt(searchResult.institutionCode)===parseInt(opponent.institutionCode)|| searchResult.institute===opponent.institute)){
                if(parseFloat(searchResult.cgpa)<parseFloat(opponent.cgpa))
                    ++collegeRank;

            }
            else{
                if(parseFloat(searchResult.cgpa)<parseFloat(opponent.cgpa))
                    ++universityRank;
            }        
        }
    });    
    searchResult.collegeRank=collegeRank;
    searchResult.universityRank=universityRank;
    return searchResult;
};

module.exports.isInTxtFile=(fileName=>{
    const fs=require('fs');
    const path=require('path');
    const basePath=path.dirname(__dirname);
    const txtFilesPath=path.join(basePath+path.sep+'Resources'+path.sep+'FinalResults');
    var currentTxtFiles=fs.readdirSync(txtFilesPath,{withFileTypes:false});
    var index=currentTxtFiles.indexOf(path.basename(fileName,'.pdf')+'.txt');
    return index<0?false:true;
});
