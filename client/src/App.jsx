import "./App.css";
import UserState from "../Context/User/userState.jsx";
import Navber from "./component/Navber/Navber.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./page/Home/Home.jsx";
import About from "./page/About/About.jsx";
import UseFor from "./page/UseFor/UseFor.jsx";
import Login from "./page/Login/Login.jsx";
import Signup from "./page/Signup/Signup.jsx";
import Faq from "./page/Faq/Faq.jsx"
import Footer from "./page/Footer/Footer.jsx";
function App() {
  return (
    <>
      {/* <UserState> */}

      <BrowserRouter>
        <Navber />
        <Routes>
          <Route path="/"  element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/use-for" element={<UseFor />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* create-event  */}
        </Routes>
        <Footer/>
      </BrowserRouter>
      {/* </UserState> */}
    </>
  );
}

export default App;
