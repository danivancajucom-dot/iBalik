import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import NavbarDashboard from "./components/NavbarDashboard/NavbarDashboard";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Homepage from "./pages/Homepage/Homepage";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import EditProfile from "./pages/EditProfile/EditProfile";
import Login from "./pages/Login/Login";
import SubmitReport from "./pages/SubmitReport/SubmitReport";
import EditReport from "./pages/EditReport/EditReport";
import ViewReport from "./pages/ViewReport/ViewReport";

function DashboardLayout() {
  return (
    <>
      <NavbarDashboard />
      <Outlet /> 
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/accInfo" element={<AccountInfo />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/submitReport" element={<SubmitReport/>} />
          <Route path="/editReport" element={<EditReport/>} />
          <Route path="/viewReport" element={<ViewReport/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
