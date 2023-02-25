function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }




document.getElementById('groupbutton').addEventListener('click',makegroup)

async function makegroup(){
    document.getElementById('groupbutton').style.visibility='hidden'
    event.preventDefault();
   ul=document.getElementById('list of users');
   ul.innerHTML="";
   let list=document.createElement('h5')
   list.innerHTML='add in group'
   ul.appendChild(list)
   const token=localStorage.getItem('token')
   let userlist=await axios.get("http://localhost:3000/user/userlist",{headers:{'Authorization':token}})
  console.log( userlist)
  decodedtoken=parseJwt(token)
  console.log(decodedtoken)
   userlist.data.filter(v=>v.id!==decodedtoken.userId).forEach(element => {
  
        
   
    ul.innerHTML+=` <input type="checkbox" id=${element.id} value=${element.id} >
                        <label for="${element.id}">${element.Name} </label><br>`

    });
 
   
   ul.innerHTML+=`<br>
   <input type="text" placeholder="Group Name" id="groupName" required="">
   <br><button id="creategroupbtn" style="
   margin: 14px;
   border-radius: 20px;
">create group</button>`


document.getElementById('creategroupbtn').addEventListener('click',sendGroupInfo)


}

async function sendGroupInfo(){
    event.preventDefault();
    const token=localStorage.getItem('token')
    if(document.getElementById('groupName').value===''){
        return alert('groupName missing')
    }
    else{
   let  list=document.querySelectorAll('input[type="checkbox"]:checked')
let Name=document.getElementById('groupName').value
     userlistwithid={}
     if(list[0]){let i=0;
        list.forEach(element => {
            userlistwithid[i]=element.value  
        i++});
     }
  let groupinfo={
    userlistwithid,
    Name:Name
  }
  
  let response=await axios.post("http://localhost:3000/group/create",groupinfo,{headers:{'Authorization':token}})
    if(response.status===201){
        alert('new group created')
  console.log("===>",response.data)

reload1()
getgroupinfo(response.data.id,response.data.groupName)
    location.reload()
    }
  
  
}
}

//window.addEventListener('DOMContentLoaded',reload1)

async function reload1(){
    document.getElementById('list of groups').innerHTML=" ";
    const token=localStorage.getItem('token')
    let response=await axios.get("http://localhost:3000/group/getgroup",{headers:{'Authorization':token}})
    console.log(response.data)
    response.data.forEach(element => {
        document.getElementById('list of groups').innerHTML+=`<li style="list-style:none; cursor: pointer; back;background-color: cornflowerblue;width: 40%;border: outset;" onclick="getgroupinfo(${element.id},'${element.groupName}')"  id=${element.id}>${element.groupName}</li>`
     });


}
//window.addEventListener('DOMContentLoaded',getgroupinfo(localStorage.getItem('groupid')))
async function getgroupinfo(id,groupName){
    event.preventDefault();
    console.log(groupName)
    localStorage.setItem('groupid',id)
    localStorage.setItem('groupName',groupName)
    document.getElementById('groupName').innerHTML=`<h5>${groupName}</h5>`
    
    
    const token=localStorage.getItem('token')
//    let gourpinfo=await axios.get(`http://localhost:3000/group/groupinfo/${id}`,{headers:{'Authorization':token}})
   showchatbox(id)
//    gourpinfo.data.forEach(element => {
//     document.innerHTML+=``
//     });  
// console.log(gourpinfo) 
ul=document.getElementById('chatspace')
ul.innerHTML="";

let userlist=await axios.get(`http://localhost:3000/group/userlist/${id}`,{headers:{'Authorization':token}})
localStorage.setItem('userlist',userlist.data)
userlist.data.forEach(element => {
 ul.innerHTML+=`<li style="list-style: none;">${element.Name} joined</li>`
 
 });
 let data=JSON.parse(localStorage.getItem(`group_${id}`))
let lastid;
let j=0;
if(data){
    console.log(data.length)
    
    lastid=data[data.length-1].id
    if(data.length>=10){
        let btn=document.createElement('button')
        btn.innerText='previousChat'
        btn.style.position='absolute'
        btn.style.bottom='-190px'
        btn.style.left='43px'
        btn.style.border='outset'
        
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

   let response=await axios.get(`http://localhost:3000/group/getchat/${id}?datalength=${lastid}`,{headers:{'Authorization':token}})
   if(data){
   response.data=data.concat(response.data)
   if(response.data.length>10){
    for(let i=0;i<response.data.length-10;i++){
        response.data.shift()}

}}
console.log(response)
    localStorage.setItem(`group_${id}`,JSON.stringify(response.data))
  
  
}
  

// async function rapiddata(id,lastid){
//     let token=localStorage.getItem('token')
//     let response=await axios.get(`http://localhost:3000/group/getchat/${id}?datalength=${lastid}`,{headers:{'Authorization':token}})
// return response
// }

async function showchatbox(id){
    document.getElementById('divchat').innerHTML=`<ul id="chatspace" style="
    position: absolute;
    left: 755px;
    top: 41px;
" ></ul>
    <form onsubmit="sendmessage(${id})" id="chatform" style="
    position: fixed;
    left: 800px;
    bottom: 0;
    width: 40%;
    background-color: purple;
    color: white;
    text-align: center;
    padding: 0px 10px 20px 10px;
    
    ">
    
        <label for="chat"></label><br>
        <input type="text" id="chat"  placeholder="message" required="" style="width:70%">
    <button type="submit"  id="formbutton">send</button>
    </form>`
    
}
async function sendmessage(id){
    event.preventDefault();
    let token=localStorage.getItem('token')
 message={
     chat:document.getElementById('chat').value}
   
   try{
    console.log(chat)
    let response=await axios.post(`http://localhost:3000/group/sendchat/${id}`,message,{headers:{'Authorization':token}})
     if(response.status===201){
        console.log('fine')
        
       
        document.getElementById('chat').value=""
        // getmsessage(id)
        getgroupinfo(id,localStorage.getItem('groupName'))
       
     }
   
}
   catch(err){
    console.log(err)
   }
} 


async function loadpreviouschat(){
    event.preventDefault();
    let id=localStorage.getItem('groupid')
    const token=localStorage.getItem('token')
    console.log(`group_${id}`)
    let data=JSON.parse(localStorage.getItem(`group_${id}`))
    
    firstdata=data[0].id
    let response=await axios.get(`http://localhost:3000/group/previouschat/${id}?firstdata=${firstdata}`,{headers:{'Authorization':token}})
       console.log(response);
      
       response.data =response.data.concat(data)
       getdata(response.data)
    }
    
    async function getdata(data){
        let j=0
        let id=localStorage.getItem('groupid')
        ul=document.getElementById('chatspace')
        ul.innerHTML="";
     const token=localStorage.getItem('token')
     let userlist=await axios.get(`http://localhost:3000/group/userlist/${id}`,{headers:{'Authorization':token}})
     localStorage.setItem('userlist',userlist.data)
     userlist.data.forEach(element => {
         ul.innerHTML+=`<li style="list-style: none;">${element.Name} joined</li>`
     
         });
         data.forEach(element => {
            if(j%2===0){
            ul.innerHTML+=`<li style="list-style: none;background-color:#8080807d;height:30px;padding:6px">${element.Name}:${element.chat} </li>`}
            else{
                ul.innerHTML+=`<li style="list-style: none;background-color:white;height:30px;padding:6px">${element.Name}:${element.chat} </li>`
            }
            j++;
     
     
    
    
    
    })}


    window.addEventListener('DOMContentLoaded',reload2)
    
    async function reload2(){
        event.preventDefault()
        reload1();
       let id=localStorage.getItem('groupid')
       getgroupinfo(id,localStorage.getItem('groupName'));
       userlist();



    }
    async function userlist(){
        const token=localStorage.getItem('token')
      let ul=document.getElementById('personal')
        let userlist=await axios.get("http://localhost:3000/user/userlist",{headers:{'Authorization':token}})
//localStorage.setItem('userlist',userlist.data)
userlist.data.forEach(element => {
    if(element.Name==='You'){
        return;
    }
    ul.innerHTML+=`<li style="list-style:none; cursor: pointer; back;background-color: cornflowerblue;width: 40%;border: outset;"  id=${element.id} onclick="personalchat(${element.id},'${element.Name}')">${element.Name}</li>`
});


    }
    async function personalchat(id,Name){
        let userlistwithid=[]
        const token=localStorage.getItem('token')
        userlistwithid[0]=id
        let groupinfo={
            userlistwithid,
            Name:Name
        }
        let response=await axios.post("http://localhost:3000/group/create",groupinfo,{headers:{'Authorization':token}})
        if(response.status===201){
            reload1()
        }
        else if(response.status===200){
            reload1()
            getgroupinfo(response.data.id,response.data.groupName)
        }
    }

