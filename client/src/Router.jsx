import { useContext, useEffect } from "react";
import Navber from "./component/Navber/Navber";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Lenis from "lenis";
import Home from "./page/Home/Home";
import About from "./page/About/About";
import UseFor from "./page/UseFor/UseFor";
import UseForDetail from "./page/UseForDetail/UseForDetail";
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
import { context } from "../Context/context";
import Profile from "./page/Profile/Profile";
import Settings from "./page/Settings/Settings";
import EventDetails from "./page/EventDetails/EventDetails";
import CreateEvent from "./component/CreateEvent/CreateEvent";
import EditEvent from "./component/EditEvent/EditEvent";
import QRCode from "./component/QRCode/QRCode";
import Selfie from "./page/Selfie/Selfie";
import BackToTop from "./component/BackToTop/BackToTop";
import ComingSoon from "./component/ComingSoon/ComingSoon";

const SmoothScrollController = ({ enabled }) => {
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    let rafId = 0;

    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [enabled]);

  return null;
};

const AppRoutes = () => {
  const userContext = useContext(context);
  const { adminlogin, CheckCookie, createEvent, editEvent, downloadQR } =
    userContext;
  const location = useLocation();

  useEffect(() => {
    CheckCookie();
  }, [CheckCookie, adminlogin]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const enableSmoothScroll =
    !adminlogin &&
    !location.pathname.startsWith("/login") &&
    !location.pathname.startsWith("/signup") &&
    !location.pathname.startsWith("/forgot-password");

  const showBackToTop =
    !adminlogin &&
    !location.pathname.startsWith("/login") &&
    !location.pathname.startsWith("/signup") &&
    !location.pathname.startsWith("/forgot-password") &&
    !location.pathname.startsWith("/event/");

  return (
    <>
      <SmoothScrollController enabled={enableSmoothScroll} />
      <BackToTop visible={showBackToTop} />
        {!adminlogin ? (
          <>
            <Navber />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/use-for" element={<UseFor />} />
              <Route path="/use-for/:slug" element={<UseForDetail />} />
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
                <Route
                  path="/dashboard/favorite"
                  element={
                    <ComingSoon
                      title="Favorites is coming soon"
                      description="A dedicated favorites space for saved media is on the way."
                    />
                  }
                />
                <Route
                  path="/dashboard/collections"
                  element={
                    <ComingSoon
                      title="Collections is coming soon"
                      description="Curated media collections and smarter organization will be available here soon."
                    />
                  }
                />
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
    </>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Router;
