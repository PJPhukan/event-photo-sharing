/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { context } from "./context";
import axios from "axios";

const UseState = (props) => {
  const clearErrorWithDelay = (message) => {
    setError(message);
    showToast(message, "error");
    window.setTimeout(() => {
      setError(null);
    }, 2500);
  };

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
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      if (!message) {
        return;
      }

      const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current, { id: toastId, message, type }]);

      window.setTimeout(() => {
        removeToast(toastId);
      }, 3200);
    },
    [removeToast]
  );
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
      setUser(res.data.data.user);
      setToken(res.data.data.token);
      localStorage.setItem("userId", res.data.data.user._id);
      localStorage.setItem("token", res.data.data.token);
      setadminlogin(true);
      showToast("Account created successfully", "success");
      return res.data;
    } catch (err) {
      clearErrorWithDelay(err.response?.data?.message || "Registration failed");
      return null;
    }
  };

  //LOGGED IN USER
  const login = async (payload) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/user/login", payload);
      if (res.data.success) {
        setUser(res.data.data.user);
        setToken(res.data.data.token);
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userId", res.data.data.user._id);
        setadminlogin(true);
        showToast("Logged in successfully", "success");
      }
      return res.data;
    } catch (err) {
      clearErrorWithDelay(err.response?.data?.message || "Login failed");
      return null;
    }
  };

  //GET USER DETAILS
  const getuser = async () => {
    await axios
      .get("/api/auth/user/getdetails")
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  };

  //LOGOUT
  const logout = async () => {
    try {
      const res = await axios.post("/api/auth/user/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setToken("");
      setUser(null);
      setadminlogin(false);
      showToast("Logged out successfully", "success");
      return res.data;
    } catch (err) {
      clearErrorWithDelay(err.response?.data?.message || "Logout failed");
    }
  };

  //PASSWORD CHANGE
  const changepassword = async (data) => {
    return await axios
      .patch("/api/auth/user/changepassword", data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        clearErrorWithDelay(
          err.response?.data?.message || "Password change failed"
        );
      });
  };

  const changeemail = async (data) => {
    try {
      return await axios.patch("/api/auth/user/changeemail", data);
    } catch (error) {
      clearErrorWithDelay(
        error.response?.data?.message || "Email change failed"
      );
    }
  };

  //UPDATE USER
  const UpdateUserDetails = async (payload) => {
    try {
      const res = await axios.patch("/api/auth/user/updateuser", payload);
      if (res.data.success) {
        setUser(res.data.data);
        showToast("Profile updated successfully", "success");
      }
    } catch (err) {
      clearErrorWithDelay(
        err.response?.data?.message || "Profile update failed"
      );
    }
  };

  //CHECK COOKIE
  const CheckCookie = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/user/check-cookie");
      if (response.data.data.token) {
        setadminlogin(true);
        setToken(response.data.data.token);
      } else {
        setadminlogin(false);
      }
    } catch (error) {
      setadminlogin(false);
    }
  }, []);
  //CHANGE PASSWORD

  //CHANGE MOBILE NUMBER

  //CHANGE AVATAR
  const ChangeAvatar = async (payload) => {
    try {
      await axios.patch("/api/auth/user/changeavater", payload);
      await getuser();
      showToast("Avatar updated successfully", "success");
    } catch (error) {
      clearErrorWithDelay(
        error.response?.data?.message || "Avatar update failed"
      );
    }
  };

  //CHANGE COVER IMAGE
  const ChangeCoverImage = async (payload) => {
    try {
      await axios.patch("/api/auth/user/changecoverimage", payload);
      await getuser();
      showToast("Cover image updated successfully", "success");
    } catch (error) {
      clearErrorWithDelay(
        error.response?.data?.message || "Cover image update failed"
      );
    }
  };
  //FORGOT PASSWORD
  const forgotPassword = async (payload) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/user/forgotpassword", payload);
      if (res.data.success) {
        showToast("OTP sent to your email", "success");
      }
      return res.data;
    } catch (error) {
      clearErrorWithDelay(
        error.response?.data?.message || "Unable to send OTP"
      );
      return null;
    }
  };

  //VERIFY OTP
  const verifyOtp = async (payload) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/user/verifyotp", payload);
      if (res.data.success) {
        showToast("OTP verified successfully", "success");
      }
      return res.data;
    } catch (error) {
      clearErrorWithDelay(
        error.response?.data?.message || "OTP verification failed"
      );
      return null;
    }
  };

  //RESET PASSWORD
  const resetPassword = async (payload) => {
    setError(null);
    try {
      const res = await axios.patch("/api/auth/user/resetpassword", payload);
      if (res.data.success) {
        setUser(res.data.data.user);
        setToken(res.data.data.token);
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userId", res.data.data.user._id);
        setadminlogin(true);
        showToast("Password reset successfully", "success");
      }
      return res.data;
    } catch (error) {
      clearErrorWithDelay(
        error.response?.data?.message || "Password reset failed"
      );
      return null;
    }
  };

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
        changeemail,
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
        setuserId,
        token,
        forgotPassword,
        verifyOtp,
        resetPassword,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {props.children}
    </context.Provider>
  );
};

export default UseState;
