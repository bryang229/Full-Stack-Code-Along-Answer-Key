class UserData {
    constructor(userJson,db) {
        this.username = userJson.username;
        this.email = userJson.email;
        this.password = userJson.password;
        this.firstName = userJson.firstName;
        this.lastName = userJson.lastName;
        this.age = userJson.age;
        this.dateRegistered = userJson.dateRegistered;
        this.picture = userJson.picture;
        this.db = db;
    }

    json() {
        return {
            "username": this.username,
            "email": this.email,
            "password": this.password,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "age": this.age,
            "dateRegistered": this.dateRegistered,
            "picture": this.picture

        }
    }


    getUserRef() {
        //Get reference of user from DB (includes methods)
        let ref =this.db.collection("Users").doc(this.username);
        return ref;
    }

    getUser(){
        //Get a json of our user
        //TODO
        let ref =this.db.collection("Users").doc(this.username).get();
        return ref;
    }
}

class Users {
    constructor(db) {
        this.db = db;
        //Users as JSONs
        this.userData = [];
        //Users as user class
        this.userArray = [];
        //Amount of users in total
        this.usersAmount = 0;
        //Last user shown
        this.index = 0;
        //Function to load all our users from our DB
        this.loadUsers();
        
    }

    async loadUsers() {
        //Getting out Users collection
        let collectionRef =this.db.collection("Users");
        //Getting all the docs in our collection with a username property
        let collectionJson = await collectionRef.where("username", "!=", null).get();
        //Using Firestore builtin for loop on our data
        collectionJson.forEach(doc => {
            this.usersAmount++;  //Inc usersAmount
            doc = doc['_fieldsProto'] //Getting all the data out our doc
            //Using our userDataToJson function to get a JSON of our data
            let tempJson = userDataToJson(doc.username['stringValue'], doc.email['stringValue'], doc.password['stringValue'], doc.firstName['stringValue'],
                doc.lastName['stringValue'], doc.age['integerValue'], doc.dateRegistered['stringValue'], doc.picture['stringValue']);
            //Creating an ExistingUser Obj and updating our arrays
            let tempUser = new ExistingUser(tempJson,this.db);
            this.userArray.push(tempUser);
            this.userData.push(doc);
            console.log(tempUser)
        });
    }


    async deleteUsers(amount) {
        //Getting "Users" collection reference 
        let collectionRef =this.db.collection("Users");
        let i = 0;  //Index variable
        for (let user of this.userArray) {
            //Only deleting the amount of users input
            //left ++ means add one then use variable 
            if (++i < amount) {
                this.usersAmount--;
                await collectionRef.doc(user.username).delete()
                this.userArray.splice(0, 1);
                this.userData.splice(0, 1);
            }
        }
        return formatDBReturn({"amount" : i})
    }

    //Function for making users based off api input
    generateUsers(userData) {
        let tempArr = [];
        //Looping through data's array
        for (let result of userData.results) {
            //Creating a json out of input data
            let data = userDataToJson(result.login.username, result.email, result.login.password, result.name.first,
                result.name.last, result.dob.age, result.registered.date, result.picture.medium);
            //Creating a NewUser Object
            let tempUser = new NewUser(data,this.db)
            //Using setUser function (we will make this)
            tempUser.setUser();
            //Creating an ExistingUser (our userArray only uses ExistingUsers)
            let secondTempUser = new ExistingUser(tempUser.json(),this.db);
            this.userArray.push(secondTempUser);
            this.userData.push(secondTempUser.json())
            tempArr.push(data)
            this.usersAmount++;
        }
        return formatDBReturn({
            "users" : tempArr
        });
    }

    getUsers(amount){
        //Checking to see if we have enough users in our list (Keeping our last place in the list in mind!)
        let range = this.usersAmount - this.index;
        let intial = this.index;
        amount = parseInt(amount);
        if(amount > range){
            return formatDBReturn("Error: Out of range");
        }
        let tempArr = []
        //Adding users into a temp array based off input and our position in array
        for(this.index ;  this.index < intial + amount; this.index++){
            //returning a user from our userArray as a JSON
            tempArr.push(this.userArray[this.index].json());
        }
        console.log("index",this.index,"amount",this.usersAmount,"range",range,"userinput",amount);

        //Making our index wrap around
        if(this.index >= this.usersAmount)
            this.index = 0;
        //returing our array of users (data)
        return formatDBReturn({
            "users" : tempArr
        });
    }

}

//Returns a formatted JSON useful for our express app!
function formatDBReturn(data){
    return {
        "results" : data
    }
}

//Function that allows us to get json out of info
function userDataToJson(username, email, password, firstName, lastName, age, dateRegistered, picture) {
    return {
        "username": username,
        "email": email,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "age": age,
        "dateRegistered": dateRegistered,
        "picture": picture

    }
}

class NewUser extends UserData {
    constructor(userDataJson,db) {
        //TODO
        super(userDataJson,db)
    }

    json(){
        return super.json();
    }

    getUser(){
        return super.getUser();
    }

    setUser(){
        let collectionRef =this.db.collection("Users");
        let ref = collectionRef.doc(this.username)
        ref.set(this.json());
        return this.getUser();
    }


    //TODO:
    //Create .json() and .getUser() all user super.functionName()
    //Create setUser() function
}

class ExistingUser extends UserData {
    constructor(userDataJson,db) {
        //TODO
        super(userDataJson,db)
    }
    //TODO:
    //Create .json() and .getUser() all user super.functionName()
    json(){
        return super.json();
    }

    getUser(){
        return super.getUser();
    }
}


module.exports = {Users, formatDBReturn}    