import { useState, useEffect } from "react";
import { context } from "./context";
import axios from "axios";

import { useCookies } from "react-cookie";

const UseState = (props) => {
  //all state management
  const [showSidebar, setshowSidebar] = useState(true); //side bar states
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [adminlogin, setadminlogin] = useState(false);
  const [showNotification, setshowNotification] = useState(false);
  const [createEvent, setcreateEvent] = useState(false);
  const [editEvent, seteditEvent] = useState(false);
  const [downloadQR, setdownloadQR] = useState(false);
  const [userId, setuserId] = useState(null);
  const [token, setToken] = useState("");
  // useEffect(() => {
  //   const tokenValue = cookies.authToken;
  //   setToken(tokenValue);
  // });
  //all api's
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setadminlogin(false);
    }
  }, []);

  //REGISTER USER
  const register = async (payload) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/user/register", payload);
      // console.log("Response:", res);
      setUser(res.data.data.user);
      // setToken(res.data.data.user._id);
      localStorage.setItem("userId", res.data.data.user._id);
      // setuserId(res.data.data.user._id);
    } catch (err) {
      // console.log(err.response.data.message);
      setError(err.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  //LOGGED IN USER
  const login = async (payload) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/user/login", payload);
      if (res.data.success) {
        setUser(res.data.data.user);
        console.log("Token value which is recieve from ", res.data.data.token); // TODO: remove after check the authenticaion
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userId", res.data.data.user._id);
        // setToken(res.data.data.user._id);
        // setuserId(res.data.data.user._id);
      }
      return res;
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);

      setTimeout(() => {
        setError(null);
      }, 2000);
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
        console.log(err);
        setUser(null);
      });
  };

  //LOGOUT
  const logout = async () => {
    try {
      const res = await axios.post("/api/auth/user/logout");
      return res.data;
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
  const UpdateUserDetails = async (payload) => {
    try {
      const res = await axios.patch("/api/auth/user/updateuser", payload);
      if (res.data.success) {
        setUser(res.data.data.user);
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

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
  const ChangeAvatar = async (payload) => {
    try {
      const response = await axios.patch(
        "/api/auth/user/changeavater",
        payload
      );
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  //CHANGE COVER IMAGE
  const ChangeCoverImage = async (payload) => {
    try {
      const response = await axios.patch(
        "/api/auth/user/changecoverimage",
        payload
      );
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };
  //FORGOT PASSWORD

  //VERIFY OTP

  //RESET PASSWORD

  //Remove notification
  const RemoveNotification = async () => {
    console.log("Remove notification");
  };

  // const get_user_id = async () => {
  //   const user_id_call = async () => {
  //     try {
  //       const response = await axios.get("/api/auth/user/get-id");
  //       setuserId(response.data.data.id);
  //       return response;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   await user_id_call();
  // };

  // useEffect(() => {
  //   if (token) {
  //     get_user_id();
  //   }
  // }, []);

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
        ChangeAvatar,
        ChangeCoverImage,
        UpdateUserDetails,
        showNotification,
        setshowNotification,
        RemoveNotification,
        setcreateEvent,
        downloadQR,
        setdownloadQR,
        createEvent,
        editEvent,
        seteditEvent,
        userId,
        token,
      }}
    >
      {props.children}
    </context.Provider>
  );
};

export default UseState;
