const express = require("express");  //Importing express (how we will host our backend)
const cors = require("cors");  //Import cors (allows us to talk to backend easily)
const bodyParser = require("body-parser")
// New app using express module
const app = express();
const axios = require("axios"); //import axios for talking to APIs

const url = "https://randomuser.me/api/"
//Setting up our app
app.use(cors());  //Starting our app using cors
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

var serviceAccount = require("../key/random-user-test-backend-firebase-adminsdk-p73bp-5a291807b8")
var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


let users;

let {Users, formatDBReturn} = require("./classes");
function checkUserDef(){
    return users == null ? false : true;
}

const db = admin.firestore();

app.post("/loadUsers", async function (req, res){
    if(!checkUserDef()){
        users = new Users(db);
        res.send(formatDBReturn(true))
    }
    else{
        res.send(formatDBReturn(false));
    }
})

app.post("/deleteUsers", function (req, res) {
    if(checkUserDef()){
        let amount = req.body.amount;
        let response = users.deleteUsers(amount)
        res.send(response);
    }
    else{
        res.send(formatDBReturn("Error: Undefined users, please post to /loadUsers first!"));
    }
})

app.post("/getExistingUsers", function (req,res){
    if(checkUserDef()){
        let amount = req.body.amount;
        let usersRes = users.getUsers(amount);
        res.send(usersRes);
    }
    else{
        res.send(formatDBReturn("Error: Undefined users, please post to /loadUsers first!"))
    }
})

app.post("/getAmount", function (req,res){
    if(checkUserDef()){
        let amount = users.usersAmount;
        res.send(formatDBReturn({
            "amount" : amount
        }));
    }
    else{
        res.send(formatDBReturn("Error: Undefined users, please post to /loadUsers first!"))
    }
})






app.post("/getNewUsers", async function (req, res) {
    if(checkUserDef()){
        let amount = req.body.amount;
        console.log(req.body);
        let usersRes = await axios.get(`${url}?results=${amount}`)
        console.log(usersRes);
        let response = users.generateUsers(usersRes.data);
        console.log(response)
        res.send(response);
   }else{
        res.send(formatDBReturn("Error: Undefined users, please post to /loadUsers first!"))
    }

})



app.listen(3000, function () {
    console.log("server is running on port 3000");
})