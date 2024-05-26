import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import UseState from "../Context/userState.jsx";
import Navber from "./component/Navber/Navber.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home/Home.jsx";
import About from "./page/About/About.jsx";
import UseFor from "./page/UseFor/UseFor.jsx";
import Login from "./page/Login/Login.jsx";
import Signup from "./page/Signup/Signup.jsx";
import Faq from "./page/Faq/Faq.jsx";
import Footer from "./page/Footer/Footer.jsx";
import TermsConditions from "./page/TermsConditions/TermsConditions.jsx";
import PrivacyPolicy from "./page/PrivacyPolicy/PrivacyPolicy.jsx";
import Testimonial from "./page/Testimonial/Testimonial.jsx";
import ForgotPassowrd from "./page/ForgotPassword/ForgotPassowrd.jsx";
import Dashboard from "./page/Dashboard/Dashboard.jsx";
import CreateEvent from "./page/CreateEvent/CreateEvent.jsx";
import { useState } from "react";
import Sidebar from "./component/Sidebar/Sidebar.jsx";
import Topbar from "./component/Topbar/Topbar.jsx";
function App() {
  AOS.init();
  // const [adminlogin, setadminlogin] = useState(false);
  const [adminlogin, setadminlogin] = useState(true);
  return (
    <>
      <UseState>

      <BrowserRouter>
        {/* visit site without log in  */}
        {!adminlogin && <Navber />}
        {!adminlogin && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/use-for" element={<UseFor />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/forgot-password" element={<ForgotPassowrd />} />
          </Routes>
        )}
        {!adminlogin && <Footer />}

        {/* Logged in users routes  */}
        {adminlogin && (
          <div className="dashboard-user">
            <Sidebar />
            <div className="sidebar-right">
              <Topbar />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* TODO  */}
                <Route
                  path="/dashboard/create-event"
                  element={<CreateEvent />}
                />
                <Route path="/dashboard/favorite" element={<CreateEvent />} />
                <Route path="/dashboard/profile" element={<CreateEvent />} />
                <Route path="/dashboard/settings" element={<CreateEvent />} />
                {/* TODO */}
                {/* /dashboard/uploads */}
                {/* /dashboard/notifications */}
              </Routes>
            </div>
          </div>
        )}
      </BrowserRouter>
      </UseState>
    </>
  );
}

export default App;
