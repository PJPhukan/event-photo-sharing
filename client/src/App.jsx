import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

import Router from "./Router.jsx";
import UseState from "../Context/userState.jsx";
// import DashboardState from "../Context/dashboardState.jsx";
function App() {
  AOS.init();

  return (
    <>
      <UseState>
        {/* <DashboardState> */}
          <Router />
        {/* </DashboardState> */}
      </UseState>
    </>
  );
}

export default App;
