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

    try{
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


document.getElementById('creategroupbtn').addEventListener('click',sendGroupInfo)}
catch(err){
    console.log(err)
}


}

async function sendGroupInfo(){
    event.preventDefault();
    try{
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
  
  
}}
catch(err){
    console.log(err)
}
}

//window.addEventListener('DOMContentLoaded',reload1)

async function reload1(){
    try{
    document.getElementById('list of groups').innerHTML=" ";
    const token=localStorage.getItem('token')
    let response=await axios.get("http://localhost:3000/group/getgroup",{headers:{'Authorization':token}})
    console.log(response.data)
    response.data.forEach(element => {
        document.getElementById('list of groups').innerHTML+=`<li style="list-style:none; cursor: pointer; back;background-color: cornflowerblue;width: 40%;border: outset;" onclick="getgroupinfo(${element.id},'${element.groupName}')"  id=${element.id}>${element.groupName}</li>`
     });

    }
    catch(err){
        console.log(err)
    }
}
//window.addEventListener('DOMContentLoaded',getgroupinfo(localStorage.getItem('groupid')))
async function getgroupinfo(id,groupName){
   // event.preventDefault();
   try{
    console.log(groupName)
    localStorage.setItem('groupid',id)
    localStorage.setItem('groupName',groupName)
    document.getElementById('groupName').innerHTML=`<h5 style="cursor: pointer;" onclick="adminPage()">${groupName}</h5>`
    
    
    const token=localStorage.getItem('token')

   showchatbox(id)

ul=document.getElementById('chatspace')


    
let userlist=await axios.get(`http://localhost:3000/group/userlist/${id}`,{headers:{'Authorization':token}})
      if(userlist.status===200){
        ul.innerHTML="";
localStorage.setItem('userlist',userlist.data)
      userlist.data.forEach(element => {
     ul.innerHTML+=`<li style="list-style: none;">${element.Name} joined</li>`
 
 });}
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
        btn.style.left='-83px'
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
   console.log(response)
   
   if(data.length>0){
    response.data=data.concat(response.data)}
  
   while(response.data>10){
    

        response.data.shift()
    console.log('response.data===>', response.data)
    
}
console.log(response.data)
    localStorage.setItem(`group_${id}`,JSON.stringify(response.data))
  
  
}catch(err){
    console.log(err)
}
}




async function showchatbox(id){
    try{
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
    catch(err){
        console.log(err)
    }
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
        
        // document.getElementById('groupName').innerHTML+=``
        document.getElementById('chat').value=""
         getmsessage(id)
       
       
       
     }

    }  
       
     
   

   catch(err){
    console.log(err)
   }
} 

// setInterval(() => {
//     getmsessage(localStorage.getItem('groupid')) 
// }, 1000);

async function getmsessage(id){
    try{
    let data=JSON.parse(localStorage.getItem(`group_${id}`))
    let token=localStorage.getItem('token')
    let lastid;
    let j=0;
    if(data){
        console.log(data.length)
        
        lastid=data[data.length-1].id
    
    
    let response=await axios.get(`http://localhost:3000/group/getchat/${id}?datalength=${lastid}`,{headers:{'Authorization':token}})
    if(response.status===201){
        console.log('fine')
        
        // document.getElementById('groupName').innerHTML+=``
        document.getElementById('chat').value=""
         
   
    response.data.forEach(element => {
        if(j%2===0){
        ul.innerHTML+=`<li style="list-style: none;background-color:#8080807d;height:30px;padding:6px">${element.Name}:${element.chat} </li>`}
        else{
            ul.innerHTML+=`<li style="list-style: none;background-color:white;height:30px;padding:6px">${element.Name}:${element.chat} </li>`
        }
       
            response.data=data.concat(response.data)
           while(response.data.length>10){
            
                 response.data.shift()
            
        }
         //console.log(response)
             localStorage.setItem(`group_${id}`,JSON.stringify(response.data))
       
        j++;
       });}
    }}
    catch(err){
        console.log(err)
    }

}




async function loadpreviouschat(){
    event.preventDefault();
    try{
    let id=localStorage.getItem('groupid')
    const token=localStorage.getItem('token')
    console.log(`group_${id}`)
    let data=JSON.parse(localStorage.getItem(`group_${id}`))
    
    firstdata=data[0].id
    let response=await axios.get(`http://localhost:3000/group/previouschat/${id}?firstdata=${firstdata}`,{headers:{'Authorization':token}})
       console.log(response);
      
       response.data =response.data.concat(data)
       getdata(response.data)}
       catch(err){
        console.log(err)
       }
    }
    
    async function getdata(data){
        let j=0
        try{
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
    catch(err){
        console.log(err)
    }
}


    window.addEventListener('DOMContentLoaded',reload2)
    
    async function reload2(){
        event.preventDefault()
        reload1();
        try{
       let id=localStorage.getItem('groupid')
       getgroupinfo(id,localStorage.getItem('groupName'));
       userlist();
        }
        catch(err){
            console.log(err)
        }


    }
    async function userlist(){
        const token=localStorage.getItem('token')
        try{
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
        catch(err){
            console.log(err)
        }

    }
    async function personalchat(id,Name){
        let userlistwithid=[]
        try{
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
        }}
        catch(err){
            console.log(err)
        }
    }

    async function adminPage(){
        window.location.href="./admin.html"
    }




//    setInterval(() => {
//     getgroupinfo(localStorage.getItem('groupid'),localStorage.getItem('groupName'))
//    }, 1000);