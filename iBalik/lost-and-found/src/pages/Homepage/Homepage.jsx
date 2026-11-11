import NavbarHome from "../../components/NavbarHome/NavbarHome";
import "./Homepage.css";

function Homepage() {
  return (
    <>
      <div className="homepage-wrapper">
        <NavbarHome />

        <div className="homepage-container">
          <div className="homepage-left-side">
            <h1>
              Lost It?
              <br />
              Report It.
              <br />
              <span className="red-text">iBalik</span> It.
            </h1>
          </div>

          <div className="homepage-right-side">
            <img
              className="logo"
              src="https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/566377510_1363935911794925_418100050343020169_n.png?stp=dst-png_s480x480&_nc_cat=100&ccb=1-7&_nc_sid=0024fc&_nc_ohc=7DlFF7a6hFYQ7kNvwGW70g5&_nc_oc=Adn36sAmNbTrM2Va-RyO-Ia-4woDx-1aomoYKYyN8HBnJCR4WVFEvZZQqmCovjErrR4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-mnl1-2.xx&oh=03_Q7cD3wHXVB6Ymi1lWE8dJ5yflq5v7fmHD3pOIv0zUXHBsF9awg&oe=6936662B"
              alt="Logo"
            />
            <img
              className="submit-report"
              src="https://scontent-mnl3-3.xx.fbcdn.net/v/t1.15752-9/576455031_1158548123046836_2652682092447286248_n.png?stp=dst-png_s565x565&_nc_cat=109&ccb=1-7&_nc_sid=0024fc&_nc_ohc=-N5Qb75WJT4Q7kNvwETwEq6&_nc_oc=AdmmFpxwUXJbYzt8l1gOHhO9cljMeu9Y85rY__ZBcrjlqndh0lg2VKy-hCAZg5GIBGw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-mnl3-3.xx&oh=03_Q7cD3wES1mu5sysAD_Y6VooS8i6GteGZXzEwlXwDKLWVk0-_dA&oe=6936741D"
              alt="Submit Report"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
