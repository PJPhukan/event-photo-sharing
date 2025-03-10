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
import Event from "./page/Event/Event";
import Sidebar from "./component/Sidebar/Sidebar";
import Topbar from "./component/Topbar/Topbar";
import { context, dashboad } from "../Context/context";
import Profile from "./page/Profile/Profile";
import Settings from "./page/Settings/Settings";
import EventDetails from "./page/EventDetails/EventDetails";
import CreateEvent from "./component/CreateEvent/CreateEvent";
import EditEvent from "./component/EditEvent/EditEvent";
import QRCode from "./component/QRCode/QRCode";
import Selfie from "./page/Selfie/Selfie";
const Router = () => {
  const userContext = useContext(context);
  const { adminlogin, CheckCookie, createEvent, editEvent, downloadQR } =
    userContext;
  useEffect(
    () => {
      CheckCookie();
    },
    [],
    [adminlogin]
  );

  // useEffect(() => {}, [adminlogin]);
// console.log(adminlogin);
  return (
    <>
      <BrowserRouter>
        {!adminlogin ? (
          <>
            <Navber />
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
              <Route path="/event/:userId/:eventId" element={<Selfie />} />
            </Routes>
            <Footer />
          </>
        ) : (
          <div className="dashboard-user">
            {createEvent && <CreateEvent />}
            {editEvent && <EditEvent />}
            <Sidebar />
            <div className="sidebar-right">
              <Topbar />
              {downloadQR && <QRCode />}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard/event" element={<Event />} />
                <Route path="/dashboard/favorite" element={<Event />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route
                  path="/dashboard/event/:eventId"
                  element={<EventDetails />}
                />
                <Route path="/event/:userId/:eventId" element={<Selfie />} />
              
              </Routes>
            </div>
          </div>
        )}
      </BrowserRouter>
    </>
  );
};

export default Router;
