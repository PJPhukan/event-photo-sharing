import { useState } from "react";
import { dashboad } from "./context";
import axios from "axios";

const DashboardState = (props) => {
  // const [showNotification, setshowNotification] = useState(false);

  return <dashboad.Provider value={{}}>{props.children}</dashboad.Provider>;
};

export default DashboardState;
