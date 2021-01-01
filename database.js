module.exports.results=[];
module.exports.subjects=[];
module.exports.insertResults=(newResult)=>{
    newResult.forEach((fresh)=>{
        let flag=false;
        for(let old of this.results){
            if(fresh.enrollmentNo==old.enrollmentNo){
                flag=true;
                fresh.semesters.forEach(freshSem=>{
                    old.semesters.push(freshSem);
                });
            }
        }
        if(flag==false){
            this.results.push(fresh);
        }
    });
};
module.exports.updateResults=(freshResults)=>{
    freshResults.forEach((freshResult)=>{
        let flag=false;
        for(let oldResult of this.results){
            if(freshResult.enrollmentNo==oldResult.enrollmentNo){
                flag=true;
                let flag2=false;
                freshResult.semesters.forEach(freshResultSem=>{
                    for(let oldSem of oldResult.semesters){
                        if(oldSem.semester==freshResultSem.semester){
                            flag2=true;
                            oldSem.creditsSecured=(parseInt(oldSem.creditsSecured)+parseInt(freshResultSem.creditsSecured))+'';
                            freshResultSem.papers.forEach(paper=>{
                                for(let oldPaper of oldSem.papers){
                                    if(oldPaper.paperId==paper.paperId){
                                        oldPaper.internal=paper.internal;
                                        oldPaper.external=paper.external;
                                        oldPaper.total=paper.total;
                                        oldPaper.grade=oldPaper.grade;
                                    }
                                }
                            });
                        }
                    }
                });
                if(flag2==false){
                    freshResult.semesters.forEach(reappearSem=>{
                        oldResult.semesters.push(reappearSem);
                    });
                }
            }
        }
        if(flag==false){
            this.results.push(freshResult);
        }
    });
};

module.exports.search=(enrollmentNo)=>{
    for(var student of this.results){
        if(student.enrollmentNo==enrollmentNo){
            return student;
        }
    }
    return null;
};

module.exports.insertSubjects=(newSubjects)=>{
    Array.prototype.indexOfSubject=function(paperId){
        for(let i=0;i<this.length;++i){
            if(this[i].paperId===paperId){
                return i;
            }
        }
        return -1;
    };
    newSubjects.forEach(subject=>{
        let index=this.subjects.indexOfSubject(subject.paperId);
        if(index===-1){
            this.subjects.push(subject);
        }
    });
};

module.exports.getSubject=(paperId)=>{
    let index=this.subjects.indexOfSubject(paperId);
    return this.subjects[index];
};