import { useState } from "react";
import context from "./context";
import axios from "axios";
const serverURI = "http://localhost:3000";
const UseState = (props) => {
  //all state management
  const [showSidebar, setshowSidebar] = useState(true); //side bar states
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [adminlogin, setadminlogin] = useState(false);

  //all api's

  const register = async (payload) => {
    try {
      const res = await axios.post(`${serverURI}/auth/user/register`, payload);
      console.log("Response:", res);
      setUser(res.data.data.user);
      // console.log("User", user);
      // console.log(res.data.data.user);
    } catch (err) {
      // console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  //LOGGED IN USER
  const login = async (payload) => {
    try {
      const res = await axios.post(`${serverURI}/auth/user/login`, payload);
      // console.log("Response:", res);
      // console.log(res.data.data.user);
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
      .get(`${serverURI}/auth/user/getdetails`)
      .then((res) => {
        console.log("Client: Inside get user details 📌📌📌📌 , 60");
        console.log(res);
      })
      .catch((err) => {
        console.log("Client: Inside get user details ❗❗❗❗");
        console.log(err);
      });
  };

  //LOGOUT
  const logout = async () => {
    try {
      const res = await axios.post(`${serverURI}/auth/user/logout`);
      console.log(res.data.data.message);
    } catch (err) {
      console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  //PASSWORD CHANGE
  const changepassword = async (data) => {
    await axios
      .post(`${serverURI}/auth/user/changepassword`, data)
      .then((res) => {
        console.log("Client: Inside change password 📌📌📌📌 , 47");
        console.log(res);
      })
      .catch((err) => {
        console.log("Client: Inside change password ❗❗❗❗");
        console.log(err);
      });
  };

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
      }}
    >
      {props.children}
    </context.Provider>
  );
};

export default UseState;
