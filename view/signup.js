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
     let response=await axios.post("http://localhost:3000/user/signup",userinfo)
}