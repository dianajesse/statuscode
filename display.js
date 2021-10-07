const express = require('express')
const app = express()
const http = require('http');
const axios = require('axios');
const timeElapsed = Date.now(); 
const today = new Date(timeElapsed); 
app.set('view engine', 'ejs');


console.log("now: "+today); 
 
 
const StatusCode1 = [ {"DomainName":"www.sourcecodenetwork.com", "statuscode":0, "time":today.toISOString() } ,  
                      {"DomainName":"www.pizarea.com", "statuscode":0,"time":today.toISOString()} ,
                      {"DomainName":"www.web.telegram.org", "statuscode":0,"time":today.toISOString()},
                      {"DomainName":"www.codeforgeek.com", "statuscode":0,"time":today.toISOString()}
                      // {"DomainName":"http://localhost:3000/display", "statuscode":0,"time":today.toISOString()}
                    ]; 
const StatusCode2 = StatusCode1.map( function(code) { 
    return code.DomainName;
   }); 
//   console.log(StatusCode1)
console.log(StatusCode2)

const statusInfo = StatusCode1.map( function(code) { 
 if( code.DomainName === "www.sourcecodenetwork.com" || code.DomainName === "www.pizarea.com"){ 
     const info = { "DomainName": code.DomainName, 
                    "statuscode": code.statuscode, 
                    "RequestTime":code.time 
                 } 
     return info; 
 } 
}); 

function connectToWebsite(domain){
    const domainKey = StatusCode2.indexOf(domain);

    axios
  .get('http://'+domain)
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    //console.log(res)
    StatusCode1[domainKey].statuscode = res.status
    StatusCode1[domainKey].time = new Date(Date.now())

  })
  .catch(error => {
    console.error(error.code)
    StatusCode1[domainKey].time = new Date(Date.now())
    StatusCode1[domainKey].statuscode = error.code
  })

}

setTimeout(() => {
    console.log('this is just a test'+ new Date(Date.now()));
    StatusCode2.forEach((domain) =>{
        console.log(domain)
        connectToWebsite(domain);
    })
}, 5000);
console.log(statusInfo);





app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.get('/display', (req, res) => {
  console.log(req.body.todo)
  res.render('table', {
    mylist: StatusCode1
  });
})
      
app.listen(3000)
