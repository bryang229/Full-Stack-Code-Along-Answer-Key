let url = "http://127.0.0.1:3000/";
//get button references
let newUsersButton = document.getElementById("newUserButton");
let oldUsersButton = document.getElementById("oldUserButton");

//Create async on click functions using an axios call

async function newUsersOnClick(e){
    e.preventDefault();
    let amount = document.getElementById("newUserAmount").value;
    if(parseInt(amount) == NaN || amount == ""){
        alert("Please enter a number");
        return;
    }
    let users = await axios.post(`${url}getNewUsers`, {
        "amount" : amount
    })

    let usersArray = users.data.results.users
    console.log(usersArray)
    for(let user of usersArray){
        createUser(user)
    }
    removeValue(document.getElementById("newUserAmount"))

}

async function oldUsersOnClick(e){
    e.preventDefault();
    let amount = document.getElementById("oldUserAmount").value;
    if(parseInt(amount) == NaN || amount == ""){
        alert("Please enter a number");
        return;
    }
    let users = await axios.post(`${url}getExistingUsers`, {
        "amount" : amount
    })
    console.log(users);
    let usersArray = users.data.results.users
    console.log(usersArray)
    for(let user of usersArray){
        createUser(user)
    }
    // removeValue(document.getElementById("oldUserAmount"))
}

function removeValue(input){
    input.value = "";
}

newUsersButton.onclick = newUsersOnClick;
oldUsersButton.onclick = oldUsersOnClick;
//Create createUser function using the 

function createUser(userData){
    let id = userData.username;
    let userDiv = new Component(id,"div",true,"main");
    let userImg = new Component(id+"Img", "img", true, id);
    userImg.rootElement.src = userData.picture;
    let userText = new Component(id+"Text",true,"p",id);
    userText.addText(`
    Username: ${userData.username} \n
    Email:    ${userData.email}\n
    Password: Nope \n
    Name: ${userData.firstName + " " + userData.lastName} \n
    Date Registered: ${userData.dateRegistered}
    `,true)
    userDiv.rootElement.className = "users"
}


let testUser = {
    "username" : "cookieBite",
    "email" : "spongeanator@bikini.com",
    "password": "garyTheSnail",
    "firstName" : "Sponge",
    "lastName": "Bob",
    "age" : 1246,
    "dateRegistered": "12/3/1812",
    "picture": "data:image/png;base64,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"
};
createUser(testUser)