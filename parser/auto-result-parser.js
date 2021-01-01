var resultParser=require('./result-parser');
var chokidar=require('chokidar');
var path=require('path');
var utils=require('../utils/utils');
module.exports=()=>{
    var pdfsPath=path.join(path.dirname(__dirname)+path.sep+'Resources'+path.sep+'PDFResults');
    console.log('Watching',pdfsPath);
    var watcher=chokidar.watch(pdfsPath,{ignored:pdfsPath+path.sep+'readme.txt'});
    watcher.on('all',(event,newFilePath)=>{
        if(event=='add'){
            let newFileName=path.basename(newFilePath);
            let isInText=utils.isInTxtFile(newFileName);
            const database=require('../database');
            if(!isInText){
                setTimeout(()=>{
                    let newResult=resultParser(newFileName,true);
                    database.updateResults(newResult.students.reappearResult);
                    database.insertResults(newResult.students.freshResult);
                    database.insertSubjects(newResult.subjects);
                },1000);
            }
            else{
                let newResult=resultParser(newFileName);
                database.updateResults(newResult.students.reappearResult);
                database.insertResults(newResult.students.freshResult);
                database.insertSubjects(newResult.subjects);
            }
        }
    });
};