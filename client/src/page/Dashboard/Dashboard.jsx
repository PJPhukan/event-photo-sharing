import React, { useContext, useEffect } from "react";
import "./dashboard.scss";
import { Link } from "react-router-dom";
import DashImg from "../../assets/dashborad-img.jpg";
import context from "../../../Context/context";

const Dashboard = () => {
  const userContext = useContext(context);
  const { getuser } = userContext;
  useEffect(() => {
    getuser()
  }, [])
  
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
                  <Link to="/dashboard/create-event"> Create Event</Link>
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
        <div className="col">
          <div className="overview">Uploads overview</div>
          <div className="weekly-overview">Weekly overview</div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
