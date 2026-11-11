import { NavLink } from 'react-router';
import './navbar-home.css';

function NavbarHome() {
  return (
    <nav>
      <div className="navbar-home">
        <div className="logo-home">
          <img
            src="https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/577098142_1720943541911709_1919201537782346271_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEP75lTO5zFewq-tYBeCROJW9InQyH-j7Jb0idDIf6Psh9wm9mtkuJH8KU1bSYbPnJmezYNX3wKB9u2_Qe7loWf&_nc_ohc=nbZqyMUR-oMQ7kNvwG8sZ3I&_nc_oc=AdnV7ylbS56MybM3jOgbhDkdxeIHWBnUetJJ5HywgJLL8AWPXsnxLe37oOR3Cyq3V9I&_nc_zt=23&_nc_ht=scontent-mnl1-2.xx&oh=03_Q7cD3wFy7Rn7gjEVglUZHIK7ShtGJpRlSxtLA5vtf9AYn433VQ&oe=6933DAE8"
            alt="logo"
          />
          <h4>iBalik</h4>
        </div>
          <NavLink to="/login"><button className="sign-in">Sign in</button></NavLink>
      </div>
    </nav>
  );
}

export default NavbarHome;
