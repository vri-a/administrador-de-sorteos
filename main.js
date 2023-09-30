let usersArr = [];
let op = 0;
let countUsers = 0;
let numberDiv = 0;
let mode ="off";
const inputAddUser = document.getElementById("add__user");
const btnAdd = document.getElementById("btn__add");
let userMsg = document.getElementById("raffle__msg");
const winnerMsg = document.getElementById("user__winner");
let winner;

/* Buttons */
function show(sec, navBack = false) {
    const sections = ["header", "sec__options", "sec__raffle", "sec__users"];
    sections.forEach(el => document.querySelector(`.${el}`).style.display = el === sec ? "flex" : "none");
    document.querySelector(".btn__back").style.display = navBack ? "flex" : "none";
   
}

document.querySelector(".btn__header").addEventListener("click", () => show("sec__options"));

document.querySelectorAll(".btn__options").forEach(elem => 
    elem.addEventListener("click", () => {
        show("sec__raffle");
        cleanMessage();
        
    })
    );

document.querySelector(".btn__home").addEventListener("click", () => show("header"));
document.getElementById("btn__users").addEventListener("click", () => {show("sec__users", true)});
document.querySelector(".btn__back").addEventListener("click", () => show("sec__raffle"));
document.getElementById("btn__op1").addEventListener("click", () => op = 1);
document.getElementById("btn__op2").addEventListener("click", () => op = 2);
/* End buttons */

function elemDisabled(elem, disabled){
    elem.disabled = disabled ? disabled : elem.removeAttribute("disabled");
    
}

function dinamicMode(createUserElement, countUsers) {
    if (mode === "on") {
        createUserElement.classList.add("dark__background");
        document.getElementById(countUsers).classList.add("color__dark");
    }

}

function showUsersNumber() {
    document.querySelector(".users__count").innerHTML = countUsers === 0 ? "" : `Participantes: ${countUsers}`;

}

// Users CRUD
function existUser(user) {
    return usersArr.includes(user);
}

function validInput(user) {
    return user.trim().length === 0;
}

function addUser() {
    const user = inputAddUser.value;
    if(validInput(user)) return userMsg.innerHTML = "Ingresa un usuario.";
    
    if(op === 1 && !existUser(user) || op === 2){
        createUser(user);
        usersArr.push(user);
        userMsg.innerHTML = "Usuario ingresado.";
    } else {
        userMsg.innerHTML = "El usuario ya existe.";
    }

}

function createUser(user){
    const secUsers = document.querySelector(".sec__users");
    const createUserElement = document.createElement("div");
    createUserElement.classList.add("sec__users-user");
    createUserElement.setAttribute("id", `d${numberDiv}`)
    ++countUsers;
    showUsersNumber();
    createUserElement.innerHTML = `<div>
    <input value=${user} id=${countUsers} class="input__edit" disabled />
    <button class="edit" onclick="edit(${countUsers})">
    <label for=${countUsers} id="edit__user">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path></svg>
    </label>
    </button>
    <button class="delete" onclick="del(d${numberDiv}, ${countUsers})">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
    </button> 
    </div>`;
    secUsers.appendChild(createUserElement);
    dinamicMode(createUserElement, countUsers);
    ++numberDiv;
}

function add() {
    addUser();
    inputAddUser.value = "";

  }

function edit(id) {
    const elem = document.getElementById(id);
    elemDisabled(elem, false);
    elem.selectionStart = elem.selectionEnd = elem.value.length;
    elem.focus();
    changeValue(elem);
}

function changeValue(elem) {
        document.addEventListener("mouseup", function change(event) {
        let id = elem.id - 1;
        if(!elem.contains(event.target) && elem.value !== usersArr[id]){
            elemDisabled(elem, true);
            document.removeEventListener("mouseup", change);
            return usersArr[id] = elem.value;
        } else if(!elem.contains(event.target)){
            document.removeEventListener("mouseup", change);
            return elemDisabled(elem, true);
        }
    });
}

function del(elem, id){
    const secUsers = document.querySelector(".sec__users");
    const username = document.getElementById(id).value;
    const idx = usersArr.indexOf(username);
    secUsers.removeChild(elem);
    if(idx != -1) usersArr.splice(idx, 1);
    --countUsers;
    showUsersNumber();
    if(winner !== undefined) cleanMessage();
    
}

btnAdd.addEventListener("click", add);

inputAddUser.addEventListener("click", ()=> cleanMessage());


document.getElementById("btn__raffle").addEventListener("click", () => {
        if(usersArr.length === 0) return userMsg.innerHTML = "No hay usuarios."
        raffle();
        elemDisabled(btnAdd, true);
})

// Raffle options
document.getElementById("btn__clean").addEventListener("click", () => {
    cleanAll();
    cleanMessage();
    userMsg.innerHTML = "La lista actual de participantes ha sido borrada.";
});

function cleanAll() {
    const secUsers = document.querySelector(".sec__users");
    const users = document.querySelectorAll(".sec__users-user");
    users.forEach(elem => {
        secUsers.removeChild(elem);
        
    });
    usersArr.length = 0;
    countUsers = 0;
    showUsersNumber();
    elemDisabled(btnAdd, false);

}

document.getElementById("btn__continue").addEventListener("click", ()=> {
    elemDisabled(btnAdd, false);
    cleanMessage();
    if(winner !== undefined)winner.style.background = "transparent";
    

});

inputAddUser.addEventListener ('keyup', (e) =>{
    //let key = document.querySelectorAll("*") ? e.code : UIEvent.which;
    if (e.key === "Enter" && !btnAdd.disabled) add();
  });
  
//dark mode 
document.querySelector(".btn__theme").addEventListener("click", () =>{
    mode = mode === "off" ? "on" : "off";
    document.querySelector("body").classList.toggle("dark")
    document.querySelector("nav").classList.toggle("dark__nav")
    document.querySelector(".presentation__content").classList.toggle("dark__border")
    document.querySelector(".presentation").classList.toggle("dark__border");
    const btns = document.querySelectorAll("button");
    btns[0].classList.toggle("color__dark");
    btns[1].classList.toggle("color__dark");
    const inputs = document.querySelectorAll("input")
    inputs.forEach(elem => { elem.classList.toggle("color__dark")});
    inputs[0].classList.toggle("dark__background");
 
    const svg = document.querySelectorAll("svg");
    for(let i = 0; i < 5; i++){
        if(i === 1){continue};
        svg[i].style.fill = svg[i].style.fill === "rgb(0, 0, 0)" ? "rgb(255, 245, 230)" : "rgb(0, 0, 0)";
    }

     const divUsers = document.querySelectorAll(".sec__users-user");
     
          divUsers.forEach(elem => {
        elem.classList.toggle("dark__background")
         }
         )     
   }

  );

function cleanMessage() {
    userMsg.innerHTML = "";
    winnerMsg.innerHTML = "";
    winnerMsg.style.border = "0";

}

function raffle() {
    show("sec__users", true);
    const users = document.querySelectorAll(".sec__users-user");
    const idx = Math.floor(Math.random() * usersArr.length);
    let i = 0;
    let bckColor = mode === "off" ? "transparent" : "#45454611";
    users.forEach(elem => elem.style.background = bckColor);
    cleanMessage();

    let run = setInterval(background, 1000);
    function background() {
        users[i].style.background = "#F3AD66";
        if(idx === i) {
            winnerMsg.style.border = "2px double #F3AD66";
            winnerMsg.innerHTML = `El usuario ganador es: ${usersArr[idx]}`;
            winner = users[i];
            return clearInterval(run);
        }
        setTimeout(() => {users[i].style.background = bckColor; i++ }, 500);
    
    }
    
}


