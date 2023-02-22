window.addEventListener('DOMContentLoaded',reload);

async function reload(e){
e.preventDefault(e);
const token=localStorage.getItem('token')
let userlist=await axios.get("http://localhost:3000/user/userlist",{headers:{'Authorization':token}})
userlist.data.forEach(element => {
        document.body.innerHTML+=`<li style="list-style: none;">${element} joined</li>`

    });



}

document.getElementById('chatform').addEventListener('submit',sendmessage)
async function sendmessage(e){
    e.preventDefault();
    let token=localStorage.getItem('token')
    let chat=e.target.chat.value
   let response=await axios.post("http://localhost:3000/user/sendchat",chat,{headers:{'Authorization':token}})
   console.log(response)
} 