loginform=document.getElementById('loginform')

loginform.addEventListener('submit',login)
async function login(e){
    e.preventDefault()
    User={Email:e.target.Email.value,
        Password:e.target.Password.value
        }
    
        try{
      response=await axios.post("http://localhost:4000/user/login",User)
    
        }
        catch(err){
            
        }
    
    
    }
