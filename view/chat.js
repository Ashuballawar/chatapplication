

//document.getElementById('formbutton').addEventListener('click',sendmessage)
async function sendmessage(e){
    event.preventDefault();
    let token=localStorage.getItem('token')
 message={
     chat:document.getElementById('chat').value}
   
   try{
    console.log(chat)
    let response=await axios.post("http://localhost:3000/user/sendchat",message,{headers:{'Authorization':token}})
     if(response.status===201){
        console.log('fine')
        document.getElementById('chat').value=""
        reload();
        
     }
   
}
   catch(err){
    console.log(err)
   }
} 


window.addEventListener('DOMContentLoaded',reload);

async function reload(){
   ul=document.getElementById('chatspace')
   ul.innerHTML="";
const token=localStorage.getItem('token')
let userlist=await axios.get("http://localhost:3000/user/userlist",{headers:{'Authorization':token}})
userlist.data.forEach(element => {
    ul.innerHTML+=`<li style="list-style: none;">${element} joined</li>`

    });

let response=await axios.get("http://localhost:3000/user/getchat",{headers:{'Authorization':token}})
  
response.data.forEach(element => {
    ul.innerHTML+=`<li style="list-style: none;">${element.Name}:${element.chat} </li>`
   });

}
