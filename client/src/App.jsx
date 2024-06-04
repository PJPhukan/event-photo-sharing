import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

import Router from "./Router.jsx";
import UseState from "../Context/userState.jsx";
function App() {
  AOS.init();

  return (
    <>
      <UseState>
        <Router />
      </UseState>
    </>
  );
}

export default App;
