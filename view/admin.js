
getuserlist()
usernotingroup()
async function getuserlist(){
    document.getElementById('adminGroupName').innerHTML=localStorage.getItem('groupName')
    let token=localStorage.getItem('token')
let userlist=await axios.get(`http://localhost:3000/group/userlist1/${localStorage.getItem('groupid')}`,{headers:{'Authorization':token}})
console.log(userlist.data)

let ul=document.getElementById('groupMember')
ul.innerHTML=`<h5>groupMember</h5>`
let flag=false;
userlist.data.forEach(element => {
    if(element.Admin===true&&element.Name==='You'){
        flag=true;
        ul.innerHTML+=`<li style="list-style: none;">${element.Name}<span style="color:red">Admin</span></li>`}})
        if(flag){
            userlist.data.filter(v=>v.Name!='You').forEach(element => {
                if(element.Admin===true){
                    ul.innerHTML+=`<li style="list-style: none;">${element.Name}<span style="color:red">Admin</span></li>`}
                
                else{
                ul.innerHTML+=`<li style="list-style: none;" id=${element.id}>${element.Name} <button onclick="makeadmin(${element.id})"  style="background-color: blue;border-radius: 18px;"${element.id})">MakeAdmin</button ><button style="margin: 2px;background-color: indianred;border-radius: 12px;" onclick="removefromgroup(${element.id})">Remove</button></li>`
   }
   })
        }
        else{
            userlist.data.filter(v=>v.Name!='You').forEach(element => {
               
                if(element.Admin===true){
                    ul.innerHTML+=`<li style="list-style: none;">${element.Name}<span style="color:red">Admin</span></li>`}
                    else{
                        ul.innerHTML+=`<li style="list-style: none;">${element.Name}</li>`
           }


            });
            ul.innerHTML+=`<li style="list-style: none;">You</li>`
        }}



        async function makeadmin(id){
            event.preventDefault();
            let userinfo={
                id:id
            }
            let token=localStorage.getItem('token')
            let groupid=localStorage.getItem('groupid')
           let response=await axios.post(`http://localhost:3000/group/makeadmin/${localStorage.getItem('groupid')}`,userinfo,{headers:{'Authorization':token}})
            if(response.status===201){
                getuserlist()  
            }
       
       
       
        }


        async function removefromgroup(id){
            event.preventDefault();
            let token=localStorage.getItem('token')
            let response=await axios.delete(`http://localhost:3000/group/delete/${localStorage.getItem('groupid')}?id=${id}`,{headers:{'Authorization':token}})
               if(response.status===200){
                getuserlist()
                usernotingroup()
               }


        }


        async function usernotingroup(){
            let token=localStorage.getItem('token')
            let userlist=await axios.get(`http://localhost:3000/group/adduser/${localStorage.getItem('groupid')}`,{headers:{'Authorization':token}})
           if(userlist.status===200){
            let ul=document.getElementById('AddMember')
            ul.innerHTML=`<h3>Add Member </h3>`
            userlist.data.forEach(element => {
                ul.innerHTML+=`<li style="list-style: none;" id=${element.id}>${element.Name}<button style="
                margin: 2px;
                background-color: darkgreen;
                border-radius: 12px;
            "onclick="AddToGroup(${element.id})">AddToGroup</button ></li>`
            });

        }

    }


    async function AddToGroup(id){
        event.preventDefault()
        let token=localStorage.getItem('token')
        let userinfo={
            id:id
        }
       
        let response=await axios.post(`http://localhost:3000/group/addtogroup/${localStorage.getItem('groupid')}`,userinfo,{headers:{'Authorization':token}})
       if(response.status===201){
       
        getuserlist()
        usernotingroup()
       }
   
   
    }

      async function grouppage(){
        window.location.href="./group.html"
      }  
        
          
           
    