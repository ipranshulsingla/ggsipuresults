module.exports=class Student{
    constructor(programme,semesters,batch,institutionCode,institute,enrollmentNo,name){
        this.enrollmentNo=enrollmentNo;
        this.name=name;
        this.programme=programme;
        this.batch=batch;
        this.institutionCode=institutionCode;
        this.institute=institute;
        this.semesters=semesters;
    }
}