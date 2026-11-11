import { useState } from "react";
import './login.css';
import { NavLink, useNavigate } from "react-router";
import { auth } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // ========== Validation functions ==========
    function validateEmail(e){
        const value = e.target.value.trim();
        const error = document.getElementById("emailError");
        error.innerHTML = "";

        if(value.length <=0) {
            error.innerHTML="No blank spaces allowed.";
            setEmail("");
        } else if (!value.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/)) {
            error.innerHTML="Invalid email format.";
            setEmail("");
        } else {
            setEmail(value);
        }
    }

 function validatePassword(e){
    const value = e.target.value.trim();
    const error = document.getElementById("passwordError");

    let message = [];

    // No blank
    if (value.length <= 0) {
        error.innerHTML = "No blank spaces allowed.";
        setPassword("");
        return;
    }

    // Length check
    if (value.length < 8){
        message.push("8 characters");
    }

    // Uppercase
    if (!value.match(/[A-Z]/)){
        message.push("1 capital letter");
    }

    // Number
    if (!value.match(/[0-9]/)){
        message.push("1 number");
    }

    // Special character
    if (!value.match(/[@$!%*?&()#^]/)){
        message.push("1 special character");
    }

    if (message.length > 0){
        error.innerHTML = "Password must at least have " + message.join(", ") + ".";
        setPassword("");
    } else {
        error.innerHTML = "";
        setPassword(value);
    }
}



    // ========== Handle Login ==========
   async function handleLogin(){
    if(!email || !password){
        alert("Please fill in both email and password correctly!");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);

        alert("Login Successfully!");

        navigate("/dashboard");

    } catch(error) { 
        console.error(error); 
        alert(error.message); // show Firebase error 
}

   }
    return (
        <div className="login-container">
            <div className="login-left-side">
                <img src="https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/577098142_1720943541911709_1919201537782346271_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEP75lTO5zFewq-tYBeCROJW9InQyH-j7Jb0idDIf6Psh9wm9mtkuJH8KU1bSYbPnJmezYNX3wKB9u2_Qe7loWf&_nc_ohc=nbZqyMUR-oMQ7kNvwG8sZ3I&_nc_oc=AdnV7ylbS56MybM3jOgbhDkdxeIHWBnUetJJ5HywgJLL8AWPXsnxLe37oOR3Cyq3V9I&_nc_zt=23&_nc_ht=scontent-mnl1-2.xx&oh=03_Q7cD3wFy7Rn7gjEVglUZHIK7ShtGJpRlSxtLA5vtf9AYn433VQ&oe=6933DAE8" alt="" />
                <h2>Welcome Back!</h2>
                <h4>Let's find what's lost and <span className="red-text">iBalik</span> what's found</h4>
            </div>

            <div className="login-right-side">
                <NavLink to="/homepage">
    <i className="fa-solid fa-arrow-left back-arrow"></i>
                </NavLink>
                <h2>Log in</h2>
                <label className="login-label">Email</label>
                <input type="email" className="log-fields" placeholder="Email" onChange={validateEmail}/>
                <p className="error-msg" id="emailError"></p>

                <label className="login-label">Password</label>
                <input type="password" className="log-fields" placeholder="Password" onChange={validatePassword}/>
                <p className="error-msg" id="passwordError"></p>

                <button onClick={handleLogin}>Login</button>

                <p>
                    Don't have an account yet? <NavLink to="/register"><span className="red-text">Click Here!</span></NavLink>
                </p>
            </div>
        </div>
    );
}

export default Login;
