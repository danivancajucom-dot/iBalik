import { NavLink, useNavigate } from 'react-router';
import './navbar-dashboard.css';
import { auth } from "../../firebase-config"; // import auth if using Firebase

function NavbarDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
            // If using Firebase auth
            if (auth) {
                auth.signOut().then(() => {
                    navigate("/homepage");
                }).catch(err => {
                    console.error("Logout error:", err);
                });
            } else {
                navigate("/homepage");
            }
        }
    };

    return (
        <nav>
            <div className="navbar-dashboard">
                <div className="logo-dashboard">
                    <img 
                        src="https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/577098142_1720943541911709_1919201537782346271_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEP75lTO5zFewq-tYBeCROJW9InQyH-j7Jb0idDIf6Psh9wm9mtkuJH8KU1bSYbPnJmezYNX3wKB9u2_Qe7loWf&_nc_ohc=nbZqyMUR-oMQ7kNvwG8sZ3I&_nc_oc=AdnV7ylbS56MybM3jOgbhDkdxeIHWBnUetJJ5HywgJLL8AWPXsnxLe37oOR3Cyq3V9I&_nc_zt=23&_nc_ht=scontent-mnl1-2.xx&oh=03_Q7cD3wFy7Rn7gjEVglUZHIK7ShtGJpRlSxtLA5vtf9AYn433VQ&oe=6933DAE8" 
                        alt="logo" 
                    />
                    <h4>iBalik</h4>
                </div>
                
                <div className="links-container">
                    <NavLink to="/dashboard">Home</NavLink>
                    <NavLink to="/accInfo">Account Info</NavLink>
                </div>

                <div>
                    <button className="logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default NavbarDashboard;
