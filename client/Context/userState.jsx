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
  const [cookies, setCookie] = useCookies();
  useEffect(() => {
    const tokenValue = cookies.authToken;
    setToken(tokenValue);
  });
  //all api's

  //REGISTER USER
  const register = async (payload) => {
    try {
      const res = await axios.post("/api/auth/user/register", payload);
      // console.log("Response:", res);
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
      return res;
    } catch (err) {
      // console.log(err.response.data.message);
      console.log(err);
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
        console.log(err);
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

  const get_user_id = async () => {
    const user_id_call = async () => {
      try {
        const response = await axios.get("/api/auth/user/get-id");
        setuserId(response.data.data.id);
        return response;
      } catch (error) {
        console.log(error);
      }
    };
    await user_id_call();
  };

  useEffect(() => {
    get_user_id();
  }, []);

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
