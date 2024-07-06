import React from "react";
import "./tabledata.scss";
const TableData = () => {
  return (
    <tr className="table-data-content">
      <td>Hello World This is my first event</td>
      <td>23</td>{/* total images and videos */}
      <td>45</td>{/* total likes */}
      <td className="show">23</td>{/**Total images */}
      <td className="show">43</td>{/**Total Videos */}
      <td className="show">15-07-2004</td>{/**Date */}
      <td>
        <button>Edit</button>
      </td>
    </tr>
  );
};

export default TableData;
