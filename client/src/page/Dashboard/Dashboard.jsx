import React, { useContext, useEffect, useState } from "react";
import "./dashboard.scss";
import DashImg from "../../assets/dashborad-img.jpg";
import { context, dashboad } from "../../../Context/context";
import TableData from "../../component/TableData/TableData";
import NoFileFound from "../../component/NoFileFound/NoFileFound";

const Dashboard = () => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalVideo, setTotalVideo] = useState(0);
  const [events, setEvents] = useState(null);
  const [noFile, setNoFile] = useState(false);
  const userContext = useContext(context);
  const dashboardContext = useContext(dashboad);
  const { getuser, setcreateEvent } = userContext;
  const {
    get_total_likes,
    get_total_event,
    get_total_image,
    get_total_video,
    get_event_data,
  } = dashboardContext;

  const dashboardDetails = async () => {
    const like_result = await get_total_likes();
    setTotalLikes(like_result.data.data[0]?.totalLikes || 0);

    const image_result = await get_total_image();
    setTotalImages(image_result.data.data[0]?.totalImage || 0);

    const event_result = await get_total_event();
    setTotalEvents(event_result.data.data[0]?.totalEvents || 0);

    const video_result = await get_total_video();
    setTotalVideo(video_result.data.data[0]?.totalVideo || 0);

    const event_data_result = await get_event_data();
    const eventDetails = event_data_result?.data?.data.event_details;
    if (eventDetails?.length > 0) {
      setEvents(eventDetails);
      setNoFile(false);
    } else {
      setEvents(null);
      setNoFile(true);
    }
  };

  useEffect(() => {
    getuser();
    dashboardDetails();
  }, []);
  useEffect(() => {});
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
                  <button onClick={() => setcreateEvent(true)}>
                    {" "}
                    Create Event
                  </button>
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
                <h2 className="amount">{totalImages}</h2>
                <i className="bx bx-images"></i>
              </div>
            </div>

            <div className="total-box">
              <div className="top">
                <h2 className="sub-heading">Videos</h2>
                <i className="bx bx-trending-up"></i>
              </div>
              <div className="bottom">
                <h2 className="amount">{totalVideo}</h2>
                <i className="bx bxs-videos"></i>
              </div>
            </div>

            <div className="total-box">
              <div className="top">
                <h2 className="sub-heading">Events</h2>
                <i className="bx bx-trending-up"></i>
              </div>
              <div className="bottom">
                <h2 className="amount">{totalEvents}</h2>
                <i className="bx bxs-calendar-event"></i>
              </div>
            </div>

            <div className="total-box">
              <div className="top">
                <h2 className="sub-heading">Likes</h2>
                <i className="bx bx-trending-up"></i>
              </div>
              <div className="bottom">
                <h2 className="amount">{totalLikes}</h2>
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
                  {events?.map((e) => {
                    return <TableData key={e._id} item={e} />;
                  })}
                </tbody>
              </table>
            </div>

            <button
              className="footer-create"
              onClick={() => setcreateEvent(true)}
            >
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
