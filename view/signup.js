const signupform=document.getElementById('signupform');


signupform.addEventListener('submit',signup);
async function signup(e){
      e.preventDefault();
      let userinfo={
        Name:e.target.Name.value,
        Email:e.target.Email.value,
        Phonenumber:e.target.Phonenumber.value,
        Password:e.target.Password.value
      }
      try{
     let response=await axios.post("http://localhost:3000/user/signup",userinfo)
       if(response.status===201){
        alert('succesfully created accout')
        window.location.href="./login.html"
       }

    
    }
     catch(err){
        console.log(err)
        if(err.response.status===403){
            alert(err.response.data.error)}
        //document.body.innerHTML+=`<div style="color:red;">${err.response.data.error}</div>`}
        else{
            document.body.innerHTML+=`<div style="color:red;">${err}</div>`
        }
     }
}