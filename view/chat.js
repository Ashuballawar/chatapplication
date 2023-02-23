    // setInterval(reload,1000);

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
localStorage.setItem('userlist',userlist.data)
userlist.data.forEach(element => {
    ul.innerHTML+=`<li style="list-style: none;">${element} joined</li>`

    });



let data=JSON.parse(localStorage.getItem('chatwithid'))
let lastid;
let j=0;
if(data){
    console.log(data.length)
    
    lastid=data[data.length-1].id
    if(data[0].id>1){
        let btn=document.createElement('button')
        btn.innerText='previousChat'
        btn.style.position='absolute'
        btn.style.bottom='75px'
        btn.style.left='16px'
        ul.appendChild(btn)
        ul.addEventListener('click',loadpreviouschat)

    }
   
data.forEach(element => {
    if(j%2===0){
    ul.innerHTML+=`<li style="list-style: none;background-color:#8080807d;height:30px;padding:6px">${element.Name}:${element.chat} </li>`}
    else{
        ul.innerHTML+=`<li style="list-style: none;background-color:white;height:30px;padding:6px">${element.Name}:${element.chat} </li>`
    }
    j++;
   });}
   else{
    lastid=0;
   }
   let response=await axios.get(`http://localhost:3000/user/getchat?datalength=${lastid}`,{headers:{'Authorization':token}})
   if(data){
   response.data=data.concat(response.data)
   if(response.data.length>10){
    for(let i=0;i<response.data.length-10;i++){
        response.data.shift()}

}}
    localStorage.setItem('chatwithid',JSON.stringify(response.data))
  
  
}


async function loadpreviouschat(){
event.preventDefault();
const token=localStorage.getItem('token')
let data=JSON.parse(localStorage.getItem('chatwithid'))
firstdata=data[0].id
let response=await axios.get(`http://localhost:3000/user/previouschat?firstdata=${firstdata}`,{headers:{'Authorization':token}})
   console.log(response);
   response.data =response.data.concat(data)
   getdata(response.data)
}

async function getdata(data){
    let j=0
    ul=document.getElementById('chatspace')
    ul.innerHTML="";
 const token=localStorage.getItem('token')
 let userlist=await axios.get("http://localhost:3000/user/userlist",{headers:{'Authorization':token}})
 localStorage.setItem('userlist',userlist.data)
 userlist.data.forEach(element => {
     ul.innerHTML+=`<li style="list-style: none;">${element} joined</li>`
 
     });
     data.forEach(element => {
        if(j%2===0){
        ul.innerHTML+=`<li style="list-style: none;background-color:#8080807d;height:30px;padding:6px">${element.Name}:${element.chat} </li>`}
        else{
            ul.innerHTML+=`<li style="list-style: none;background-color:white;height:30px;padding:6px">${element.Name}:${element.chat} </li>`
        }
        j++;
 
 



})}