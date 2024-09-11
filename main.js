import axios from "axios";

let notelistRootElement = document.querySelector('.noteslist');
let noteBtn = document.querySelector('.createButton');

let notes = [];

let updating_ID = null;


noteBtn.addEventListener('click',async()=>{
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const role = document.getElementById('role').value;
    const availability = document.querySelector('input[name="availability"]:checked')?
    document.querySelector('input[name="availability"]:checked').value:"";

    if(!first_name||!last_name||!email||!mobile||!role){
        document.getElementById('warning_msg').innerText = "All fields are required";
    }else{
        let body = {first_name,last_name,email,mobile,role,availability};

        if(updating_ID){
            let res = await axios.put(`https://restapi-479e.onrender.com/api/v1/players/update-player/${updating_ID}`,body);
            updating_ID = null;
            noteBtn.innerText = "Add Player";
            
        }else{
            let res = await axios.post("https://restapi-479e.onrender.com/api/v1/players/add-player",body);
            document.getElementById('warning_msg').innerText = "";
        }
    
        renderElementsToScreen();
    
        document.getElementById('first_name').value = '';
        document.getElementById('last_name').value ='';
        document.getElementById('email').value='';
        document.getElementById('mobile').value='';
        document.getElementById('role').value='';
        document.querySelector('input[name="availability"]').value = null;
    
    }

    // let body = {first_name,last_name,email,mobile,role,availability};

    // if(updating_ID){
    //     let res = await axios.put(`http://localhost:2024/api/v1/players/update-player/${updating_ID}`,body);
    //     updating_ID = null;
    //     noteBtn.innerText = "Add Player";
        
    // }else{
    //     let res = await axios.post("http://localhost:2024/api/v1/players/add-player",body);
    //     document.getElementById('warning_msg').innerText = "";
    // }

    // renderElementsToScreen();

    // document.getElementById('first_name').value = '';
    // document.getElementById('last_name').value ='';
    // document.getElementById('email').value='';
    // document.getElementById('mobile').value='';
    // document.getElementById('role').value='';
    // document.querySelector('input[name="availability"]').value = null;


});


async function renderElementsToScreen(){
    notelistRootElement.innerHTML = '';
    try{
        const players = await axios.get('http://localhost:2024/api/v1/players/get-players');
        console.log(players.data.data);
        notes = players.data.data;
    }catch(error){
        console.log(error);
    }

    if(Array.isArray(notes)){
        notes.forEach(note=>{
            addnoteToNoteList(note,note._id)
        });
    }
    
}
renderElementsToScreen();

function addnoteToNoteList(note,uniqueID){

    let notediv = document.createElement('div');
    notediv.classList.add('note', uniqueID);
    let noteTitle = document.createElement('h4');
    let content = document.createElement('p');
    let playermobile = document.createElement('p');
    let playeravailability = document.createElement('p');
    let playerrole = document.createElement('p');
    let notedeletebutton = document.createElement('button');
    const noteupdatebutton = document.createElement('button');

    noteTitle.innerText = `Name: ${note.first_name} ${note.last_name}`;
    content.innerText = `Email:${note.email}`;
    playermobile.innerText = `Mobile: ${note.mobile}`;
    playerrole.innerText = `Role:${note.role}`;
    playeravailability.innerText = `Availability: ${note.availability}`;
    notedeletebutton.innerText = "Delete";
    noteupdatebutton.innerText = "Update";

    notedeletebutton.addEventListener('click',() => {
        removeElementFromNoteList(uniqueID);
    })

    noteupdatebutton.addEventListener('click',()=>{
        updatePlayers(uniqueID, note);
    })
    
    notediv.appendChild(noteTitle);
    notediv.appendChild(content);
    notediv.appendChild(playermobile);
    notediv.appendChild(playerrole);
    notediv.appendChild(playeravailability);
    notediv.appendChild(notedeletebutton);
    notediv.appendChild(noteupdatebutton);

    notelistRootElement.appendChild(notediv);
}

async function removeElementFromNoteList(id){

    let res = await axios.delete(`https://restapi-479e.onrender.com/api/v1/players/delete-player/${id}`);

    console.log(res.data);
    renderElementsToScreen();

}



async function updatePlayers(uniqueID, note){
    updating_ID = uniqueID;
    document.getElementById('first_name').value = note.first_name;
    document.getElementById('last_name').value = note.last_name;
    document.getElementById('email').value = note.email;
    document.getElementById('mobile').value = note.mobile;
    note.availability ? document.getElementById('role_yes').checked = true : document.getElementById('role_no').checked = true;
    document.querySelector('.createButton').innerText = "Update";

}