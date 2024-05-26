import { useState } from "react";
import context from "./context";
import axios from "axios";

const UseState = (props) => {
  //all state management
  const [showSidebar, setshowSidebar] = useState(true);//side bar states

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

  return (
    <context.Provider value={{ showSidebar, setshowSidebar }}>
      {props.children}
    </context.Provider>
  );
};

export default UseState;
