const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

var admin = require("firebase-admin");

var serviceAccount = require("./shorten-6bde1-firebase-adminsdk-ebx5f-96b87c7bf3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const static = express.static("public");

app.use(static);
app.use(bodyParser.json());

const urlsdb = admin.firestore().collection("urlsdb");
const usersdb = admin.firestore().collection("usersdb");


app.get("/:short",(req,res)=>{
    console.log(req.params.short);
    const short = req.params.short;
    const doc = urlsdb.doc(short);

    doc.get()
    .then(response=>{
        const data = response.data();
        console.log(data)
        if(data && data.url){
            res.redirect(301,data.url);
        }
        else{
            res.redirect(301,"https://codeforcause.org");
        }
    })
})

app.post("/admin/urls",(req,res)=>{
    const {email,password,short,url} = req.body;
    console.log(email,password,short,url);
    usersdb.doc(email).get()
    .then(response=>{
        const user = response.data();
        console.log(user)
        if(user && user.email==email && user.password){
            const doc = urlsdb.doc(short);
            console.log(doc);
            doc.set({url});
            res.send("done");
        }
        else{
            res.send(403,"Not possible");
        }
    })

})

app.listen(port,()=>{
    console.log("Listening at 5000");
})