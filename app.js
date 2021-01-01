const express=require('express');
const utils=require('./utils/utils');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const autoResultParser=require('./parser/auto-result-parser');
const database=require('./database');
var app=express();
app.use(morgan('tiny'));
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.post('/result',(request,response)=>{
    var enno=request.body.enno;
    var searchResult=database.search(enno);
    if(searchResult!=null){
        searchResult.semesters.sort((a,b)=>{
        return parseInt(a.semester)-parseInt(b.semester);
        });
    }
    else{
        response.send(`<h1>Please double check your enrollment number!</h1>
        <a href='index.html'>Try Again</a>`);
        return;
    }
    searchResult=utils.prepareFullResult(searchResult);
    searchResult=utils.rankCalc(searchResult);
    response.render('result.ejs',{'result':searchResult});
});

var server=app.listen(process.env.PORT,()=>{
    autoResultParser();
    console.log(database);
    console.log('Server started @ PORT ',server.address().port);
    console.log('Click to see','http://localhost:'+server.address().port);
});