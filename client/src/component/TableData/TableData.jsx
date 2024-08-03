import React, { useContext, useEffect } from "react";
import { context, dashboad } from "../../../Context/context";

import "./tabledata.scss";
const TableData = ({ item }) => {
  useEffect(() => {
    item;
  });

  const dashboardContext = useContext(dashboad);
  const { seteditEvent } = useContext(context);
  const { seteventId } = dashboardContext;

  const handleEdit = () => {
    seteventId(item?._id);
    seteditEvent(true);
  };

  let image = 0;
  let video = 0;
  const returnTimeDate = (time) => {
    const date = new Date(time);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const media = item.image_details?.length > 0 ? item.image_details?.length : 0;
  const likes =
    item.likes_details?.length > 0 ? item?.likes_details[0]?.totallikes : 0;
  item.resource_type_details.forEach((element) => {
    if (element._id === "image") {
      image = element.count;
    } else {
      video = element.count;
    }
  });
  return (
    <tr className="table-data-content">
      <td>{item.EventName}</td>
      <td>{media}</td>
      <td>{likes}</td>
      <td className="show">{image}</td>
      <td className="show">{video}</td>
      <td className="show">{returnTimeDate(item.EventDate)}</td>
      <td onClick={handleEdit}>
        <button>Edit</button>
      </td>
    </tr>
  );
};

export default TableData;
