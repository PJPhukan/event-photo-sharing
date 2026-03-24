import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fabric } from "fabric";
import "./event-card-share.scss";

const EventCardShare = () => {
  const { cardId } = useParams();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return undefined;
    const fabricCanvas = new fabric.Canvas(canvasEl, {
      backgroundColor: "#0f111a",
      selection: false,
    });
    fabricRef.current = fabricCanvas;
    return () => {
      fabricCanvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    const fetchCard = async () => {
      if (!cardId) return;
      setStatus("loading");
      try {
        const res = await axios.get(`/api/cards/share/${cardId}`);
        const card = res?.data?.data;
        if (!card) {
          setStatus("error");
          return;
        }

        const fabricCanvas = fabricRef.current;
        if (!fabricCanvas) return;

        fabricCanvas.setWidth(card.canvasSize?.width || 600);
        fabricCanvas.setHeight(card.canvasSize?.height || 800);
        if (card.background) {
          fabricCanvas.setBackgroundColor(
            card.background,
            fabricCanvas.renderAll.bind(fabricCanvas)
          );
        }
        fabricCanvas.loadFromJSON(card.elements || {}, () => {
          fabricCanvas.renderAll();
          setStatus("ready");
        });
      } catch (error) {
        setStatus("error");
      }
    };

    fetchCard();
  }, [cardId]);

  return (
    <section className="event-card-share">
      {status === "loading" && <div className="share-message">Loading card…</div>}
      {status === "error" && (
        <div className="share-message">Card not found or unavailable.</div>
      )}
      <div className="share-canvas">
        <canvas ref={canvasRef} />
      </div>
    </section>
  );
};

export default EventCardShare;
