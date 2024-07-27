import React, { useContext, useEffect,useState } from "react";
import "./dashboard.scss";
import { Link } from "react-router-dom";
import DashImg from "../../assets/dashborad-img.jpg";
import {context} from "../../../Context/context";
import TableData from "../../component/TableData/TableData";
import NoFileFound from "../../component/NoFileFound/NoFileFound";

const Dashboard = () => {
  const userContext = useContext(context);
  const { getuser,setcreateEvent } = userContext;
  const [noFile, setnoFile] = useState(false);
  useEffect(() => {
    getuser();
  }, []);

  return (
    <>
      <section className="dashboard">
        <div className="heading">Dashboard</div>
        <div className="col">
          <div className="overview">
            <div className="overview-box">
              <div className="left-box">
                <div className="sub-text">Create your own event</div>
                <div className="text">
                  Memois is an event photo sharing website with a user-friendly
                  dashboard. It uses face recognition technology to help you
                  effortlessly upload, organize, and share your event photos and
                  videos with friends and family.
                </div>
                <div className="create-event">
                  <button onClick={()=>setcreateEvent(true)}> Create Event</button>
                </div>
              </div>
              <div className="right-box">
                <img src={DashImg} alt="" />
              </div>
            </div>
          </div>
          <div className="total">
            <div className="total-box">
              <div className="top">
                <h2 className="sub-heading">Images</h2>
                <i className="bx bx-trending-up"></i>
              </div>
              <div className="bottom">
                <h2 className="amount">119</h2>
                <i className="bx bx-images"></i>
              </div>
            </div>

            <div className="total-box">
              <div className="top">
                <h2 className="sub-heading">Videos</h2>
                <i className="bx bx-trending-up"></i>
              </div>
              <div className="bottom">
                <h2 className="amount">1200</h2>
                <i className="bx bxs-videos"></i>
              </div>
            </div>

            <div className="total-box">
              <div className="top">
                <h2 className="sub-heading">Events</h2>
                <i className="bx bx-trending-up"></i>
              </div>
              <div className="bottom">
                <h2 className="amount">4</h2>
                <i className="bx bxs-calendar-event"></i>
              </div>
            </div>

            <div className="total-box">
              <div className="top">
                <h2 className="sub-heading">Likes</h2>
                <i className="bx bx-trending-up"></i>
              </div>
              <div className="bottom">
                <h2 className="amount">1200</h2>
                <i className="bx bxs-like"></i>
              </div>
            </div>
          </div>
        </div>
        {!noFile ? (
          <div className="tabuler--wrapper col">
            <h3 className="main--title">Your Event Overview</h3>
            <div className="table--container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Media</th>
                    <th>Likes</th>
                    <th className="show">Images</th>
                    <th className="show">Videos</th>
                    <th className="show">Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <TableData />
                  <TableData />
                  <TableData />
                </tbody>
              </table>
            </div>

            <button className="footer-create" onClick={()=>setcreateEvent(true)} >
              Create New Event
            </button>
          </div>
        ) : (
          <div className="col no-event-box">
            <NoFileFound />
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;
