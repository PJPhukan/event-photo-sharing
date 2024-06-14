import React, { useState, useContext, useEffect } from "react";
import Navber from "./component/Navber/Navber";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home/Home";
import About from "./page/About/About";
import UseFor from "./page/UseFor/UseFor";
import Login from "./page/Login/Login";
import Signup from "./page/Signup/Signup";
import Faq from "./page/Faq/Faq";
import Footer from "./page/Footer/Footer";
import TermsConditions from "./page/TermsConditions/TermsConditions";
import PrivacyPolicy from "./page/PrivacyPolicy/PrivacyPolicy";
import Testimonial from "./page/Testimonial/Testimonial";
import ForgotPassowrd from "./page/ForgotPassword/ForgotPassowrd";
import Dashboard from "./page/Dashboard/Dashboard";
import CreateEvent from "./page/CreateEvent/CreateEvent";
import Sidebar from "./component/Sidebar/Sidebar";
import Topbar from "./component/Topbar/Topbar";
import context from "../Context/context";
import Profile from "./page/Profile/Profile";
import Settings from "./page/Settings/Settings";
const Router = () => {
  const userContext = useContext(context);
  const { adminlogin, CheckCookie } = userContext;

  useEffect(() => {
    CheckCookie();
  },[],[adminlogin]);

  // useEffect(() => {}, [adminlogin]);

  return (
    <>
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
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                {/* TODO */}
                {/* /dashboard/uploads */}
                {/* /dashboard/notifications */}
                {/* /logout  */}
              </Routes>
            </div>
          </div>
        )}
      </BrowserRouter>
    </>
  );
};

export default Router;
