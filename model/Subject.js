module.exports=class Subject{
    constructor(paperId,paperCode,passMarks,maxMarks,major,minor,kind,mode,exam,type,credits,name){
        this.paperId=paperId;
        this.paperCode=paperCode;
        this.passMarks=passMarks;
        this.maxMarks=maxMarks;
        this.major=major;
        this.minor=minor;
        this.kind=kind;
        this.mode=mode;
        this.exam=exam;
        this.type=type;
        this.credits=credits;
        this.name=name;
    }
}