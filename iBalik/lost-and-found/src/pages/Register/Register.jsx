import { useState } from "react";
import './register.css';
import { NavLink } from "react-router";
import { auth, db } from "../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

function Register() {
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [birthday, setBirthday] = useState("");
    const [register, setRegister] = useState(false);  

    // ================= Validation functions =================
    function validateFirstName(e){
        const value = e.target.value.trim();
        const error = document.getElementById("fNameError");
        error.innerHTML="";
        if(value.length <= 0) {
            error.innerHTML="No blank spaces allowed.";
            setFName("");
        } else if (value.length < 2){
            error.innerHTML="First Name must be at least 2 characters.";
            setFName("");
        } else {
            setFName(value);
        }
    }

    function validateLastName(e){
        const value = e.target.value.trim();
        const error = document.getElementById("lNameError");
        error.innerHTML="";
        if(value.length <= 0) {
            error.innerHTML="No blank spaces allowed.";
            setLName("");
        } else if (value.length < 2){
            error.innerHTML="Last Name must be at least 2 characters.";
            setLName("");
        } else {
            setLName(value);
        }
    }

    function validateEmail(e){
        const value = e.target.value.trim();
        const error = document.getElementById("emailError");
        error.innerHTML="";
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



    function validateConfirmPassword(e){
        const value = e.target.value.trim();
        const error = document.getElementById("confirmPasswordError");
        error.innerHTML = "";
        if(value !== password){
            error.innerHTML = "Passwords do not match.";
            setConfirmPassword("");
        } else {
            setConfirmPassword(value);
        }
    }

    function validateContact(e){
        const value = e.target.value.trim();
        const error = document.getElementById("contactError");
        error.innerHTML="";
        if(value.length <=0) {
            error.innerHTML="No blank spaces allowed.";
            setContact("");
        } else if (!value.match(/^09\d{9}$/)) {
            error.innerHTML="Contact number must start with 09 and be 11 digits.";
            setContact("");
        } else {
            setContact(value);
        }
    }

    function validateAddress(e){
        const value = e.target.value.trim();
        const error = document.getElementById("addressError");
        error.innerHTML="";
        if(value.length <= 0) {
            error.innerHTML="No blank spaces allowed.";
            setAddress("");
        } else if (value.length < 2){
            error.innerHTML="Address must be at least 2 characters.";
            setAddress("");
        } else {
            setAddress(value);
        }
    }

    function validateBirthday(e){
        const value = e.target.value;
        const error = document.getElementById("dateError");
        error.innerHTML="";
        const currentDay = new Date();
        const setDate = new Date(value);
        if(setDate >= currentDay) {
            error.innerHTML="Future date is not accepted.";
            setBirthday("");
        } else {
            setBirthday(value);
        }
    }

 
async function validateRegistration(){

    const missing = [];

   
    if (!fName) missing.push("First Name");
    if (!lName) missing.push("Last Name");
    if (!email) missing.push("Email");

    
    if (!password && !confirmPassword) {
        
        missing.push("Password");
    } else {
        if (!password) missing.push("Password");
        if (!confirmPassword) missing.push("Confirm Password");
    }

    if (!contact) missing.push("Contact");
    if (!address) missing.push("Address");
    if (!birthday) missing.push("Birthdate");

  
    if (missing.length > 1) {
        alert("Please fill all fields!");
        return;
    }


    if (missing.length === 1) {
        alert(`${missing[0]} Field is required!`);
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, `users/${user.uid}`), {
            firstName: fName,
            lastName: lName,
            email,
            contact,
            address,
            birthday,
            role: "user",
            createdAt: new Date().toISOString()
        });

        alert("Registration successful!");
        window.location.href = "/login";

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}






    return (
        <>
        {!register &&
            <div className="register-container">
                <div className="register-left-side">
                    <h2>Register</h2>

                    <label className="reg-label">First Name</label>
                    <input type="text" className="reg-fields" placeholder="First Name" onChange={validateFirstName}/>
                    <p className="error-msg" id="fNameError"></p>

                    <label className="reg-label">Last Name</label>
                    <input type="text" className="reg-fields" placeholder="Last Name" onChange={validateLastName}/>
                    <p className="error-msg" id="lNameError"></p>

                    <label className="reg-label">Email</label>
                    <input type="email" className="reg-fields" placeholder="Email" onChange={validateEmail}/>
                    <p className="error-msg" id="emailError"></p>

                    <label className="reg-label">Password</label>
                    <input type="password" className="reg-fields" placeholder="Password" onChange={validatePassword}/>
                    <small className="password-hint">
                        At least 8 chars, 1 uppercase, 1 number & 1 special char.
                    </small>
                    <p className="error-msg" id="passwordError"></p>

                    <label className="reg-label">        Confirm Password</label>
                    <input type="password" className="reg-fields" placeholder="Confirm Password" onChange={validateConfirmPassword}/>
                    <p className="error-msg" id="confirmPasswordError"></p>

                    <label className="reg-label">Contact Number</label>
                    <input type="text" className="reg-fields" placeholder="Contact Number" onChange={validateContact}/>
                    <p className="error-msg" id="contactError"></p>

                    <label className="reg-label">Address</label>
                    <input type="text" className="reg-fields" placeholder="Address" onChange={validateAddress}/>
                    <p className="error-msg" id="addressError"></p>

                    <label className="reg-label">Birthday</label>
                    <input type="date" className="reg-fields" onChange={validateBirthday}/>
                    <p className="error-msg" id="dateError"></p>

                    
                <button onClick={validateRegistration}>Register</button>

                    
                    <p>
                        Already have an account? <NavLink to="/login"><span className="red-text">Click Here!</span></NavLink>
                    </p>
                </div>

                <div className="register-right-side">
                    <img src="https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/577098142_1720943541911709_1919201537782346271_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEP75lTO5zFewq-tYBeCROJW9InQyH-j7Jb0idDIf6Psh9wm9mtkuJH8KU1bSYbPnJmezYNX3wKB9u2_Qe7loWf&_nc_ohc=nbZqyMUR-oMQ7kNvwG8sZ3I&_nc_oc=AdnV7ylbS56MybM3jOgbhDkdxeIHWBnUetJJ5HywgJLL8AWPXsnxLe37oOR3Cyq3V9I&_nc_zt=23&_nc_ht=scontent-mnl1-2.xx&oh=03_Q7cD3wFy7Rn7gjEVglUZHIK7ShtGJpRlSxtLA5vtf9AYn433VQ&oe=6933DAE8" alt="" />
                    <h2>Join <span className="red-text">iBalik</span>!</h2>
                    <h4>Where every lost thing finds its way home.</h4>
                </div>
            </div>
        }

        {register &&
            <div className="register-container">
                <h2>Registration successful!</h2>
                <p>Click below to go to login page:</p>
                <NavLink to="/login">
                    <button>Go to Login</button>
                </NavLink>
            </div>
        }
        </>
    );  
}

export default Register;
