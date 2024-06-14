import { useState } from "react";
import context from "./context";
import axios from "axios";
const UseState = (props) => {
  //all state management
  const [showSidebar, setshowSidebar] = useState(true); //side bar states
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [adminlogin, setadminlogin] = useState(false);

  //all api's

  //REGISTER USER
  const register = async (payload) => {
    try {
      const res = await axios.post("/api/auth/user/register", payload);
      console.log("Response:", res);
      setUser(res.data.data.user);
    } catch (err) {
      // console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  //LOGGED IN USER
  const login = async (payload) => {
    try {
      const res = await axios.post("/api/auth/user/login", payload);
      if (res.data.success) {
        setUser(res.data.data.user);
      }
    } catch (err) {
      // console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  //GET USER DETAILS
  const getuser = async () => {
    await axios
      .get("/api/auth/user/getdetails")
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch((err) => {
        setUser(null);
      });
  };

  //LOGOUT
  const logout = async () => {
    try {
      await axios.post("/api/auth/user/logout");
      console.log("Logout succesfully");
    } catch (err) {
      console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  //PASSWORD CHANGE
  const changepassword = async (data) => {
    await axios
      .post("/api/auth/user/changepassword", data)
      .then((res) => {
        console.log("Client: Inside change password 📌📌📌📌 , 47");
        console.log(res);
      })
      .catch((err) => {
        console.log("Client: Inside change password ❗❗❗❗");
        console.log(err);
      });
  };

  //UPDATE USER

  //CHECK COOKIE
  const CheckCookie = async () => {
    try {
      const response = await axios.get("/api/auth/user/check-cookie");
      // console.log(response.data);
      if (response.data.data.token) {
        setadminlogin(true);
      } else {
        setadminlogin(false);
      }
    } catch (error) {}
  };
  //CHANGE PASSWORD

  //CHANGE MOBILE NUMBER

  //CHANGE AVATAR

  //CHANGE COVER IMAGE

  //FORGOT PASSWORD

  //VERIFY OTP

  //RESET PASSWORD

  return (
    <context.Provider
      value={{
        showSidebar,
        setshowSidebar,
        register,
        login,
        getuser,
        logout,
        changepassword,
        adminlogin,
        error,
        setadminlogin,
        setError,
        user,
        CheckCookie,
      }}
    >
      {props.children}
    </context.Provider>
  );
};

export default UseState;
