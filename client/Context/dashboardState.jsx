import { useState } from "react";
import context from "./context";
import axios from "axios";

const DashboardState = (props) => {
  const [showNotification, setshowNotification] = useState(false);

  return (
    <context.Provider value={{ showNotification, setshowNotification }}>
      {props.children}
    </context.Provider>
  );
};

export default DashboardState;
