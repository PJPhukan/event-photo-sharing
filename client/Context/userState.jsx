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

  // const [jokes, setjokes] = useState([]);
  // //get all joke from the backend
  // const getJoke = async () => {
  //   axios
  //     .get("/api/joke")
  //     .then((res) => {
  //       setjokes(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  //REGISTER USER
  /**
       const register = async (payload) => {
          await axios
          .post(`${serverURI}/auth/user/register`, payload)
          .then((res) => {
              console.log("Client: Inside User register 📌📌📌📌");
              console.log(res);
              setUser(res.user);
            })
            .catch((err) => {
              console.log("Client: Inside User register ❗❗❗❗", 35);
              console.log(err.response.data.message);
              setError(err.response.data.message);
          });
      };
    */
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
    await axios
      .post(`${serverURI}/auth/user/login`, payload)
      .then((res) => {
        console.log("Client: Inside User login 📌📌📌📌 , 45");
        console.log(res);
        setUser(res.user);
      })
      .catch((err) => {
        console.log("Client: Inside User login ❗❗❗❗");
        console.log(err);
      });
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
    await axios
      .post(`${serverURI}/auth/user/logout`)
      .then((res) => {
        console.log("Client: Inside Logout 📌📌📌📌 , 74");
        console.log(res);
      })
      .catch((err) => {
        console.log("Client: Inside Logout ❗❗❗❗");
        console.log(err);
      });
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
        setadminlogin,
        error,
        setError,
      }}
    >
      {props.children}
    </context.Provider>
  );
};

export default UseState;
