var fs=require('fs'),
child_process = require('child_process'),
path=require('path'),
os=require('os'),
subjectParser=require('./subject-parser'),
studentParser=require('./student-parser');

module.exports=(fileName,pdfToTxt=false)=>{
    var obj={};
    var basepath=path.dirname(__dirname);
    var pdfPath=path.join(basepath+path.sep+'Resources'+path.sep+'PDFResults'+path.sep+fileName);
    var txtPath=path.join(basepath+path.sep+'Resources'+path.sep+'FinalResults'+path.sep+path.basename(fileName,'.pdf')+'.txt');
    if(pdfToTxt){
        try{
            if(os.platform=='linux')
                child_process.execSync(`pdftotext -raw ${pdfPath} ${txtPath}`);
            else
                child_process.execSync(`cd /d ${path.dirname(pdfPath)}`+'&'+`pdftotext -raw ${fileName} ${'../FinalResults/'+path.basename(fileName,'.pdf')+'.txt'}`);
            console.log('New File Added',fileName);
        }
        catch(err){
            console.log('Server Crashed\nConversion Failed PDF to TEXT\n');
            process.exit();
        }
    }
    var result=fs.readFileSync(txtPath,'utf8');
    var subjectsRegex=/S\.No\. Paper([^]*?)\f/g;
    var subjectsArray=result.match(subjectsRegex);
    obj.subjects=subjectParser(subjectsArray);
    var studentsRegex=/Result of Programme Code:([^]*?)\f/g;
    var studentsArray=result.match(studentsRegex);
    obj.students=studentParser(studentsArray);
    return obj;
};