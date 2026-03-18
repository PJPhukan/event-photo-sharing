import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

import Router from "./Router.jsx";
import UseState from "../Context/userState.jsx";
import DashboardState from "../Context/dashboardState.jsx";
import SplashScreen from "./component/SplashScreen/SplashScreen";
import GlobalBackground from "./component/GlobalBackground/GlobalBackground";
import Toast from "./component/Toast/Toast";

function App() {
  const shouldShowSplash = (() => {
    if (typeof performance === "undefined") {
      return true;
    }
    const [navEntry] = performance.getEntriesByType("navigation");
    const navType = navEntry?.type;
    return navType ? navType !== "back_forward" : true;
  })();

  const [showSplash, setShowSplash] = useState(shouldShowSplash);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
    });
  }, []);

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1900);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [showSplash]);

  return (
    <>
      <GlobalBackground />
      <SplashScreen visible={showSplash} />
      {!showSplash && (
        <UseState>
          <DashboardState>
            <Toast />
            <Router />
          </DashboardState>
        </UseState>
      )}
    </>
  );
}

export default App;
