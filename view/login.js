loginform=document.getElementById('loginform')

loginform.addEventListener('submit',login)
async function login(e){
    e.preventDefault()
    User={Email:e.target.Email.value,
        Password:e.target.Password.value
        }
    
        try{
      response=await axios.post("http://localhost:3000/user/login",User)
      if(response.status==201){
        alert('login successful')
        console.log(response.data.token)
        alert('login Successfull')
        localStorage.setItem('token',response.data.token)
        }
    
    }


        catch(err){
            document.body.innerHTML+=`<div style="color:red;">${err}</div>`
        }
    
    
    }
