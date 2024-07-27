import React, { useState, useRef, useContext } from "react";
import QRCode from "qrcode.react";
import "./qrcode.scss";
import {context} from "../../../Context/context";
const QRcode = () => {
  const [text, setText] = useState("Paragjyoti Phukan");
  const qrRef = useRef();
  const QRContext = useContext(context);
  const { setdownloadQR} = QRContext;
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "QRCode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <div className="qr-code-main">
      <div className="qr-content">
        <button
          className="close-button"
          onClick={() => setdownloadQR(false)}
        >
          <i className="bx bx-x"></i>
        </button>
        <h5 className="heading">Download QR Code</h5>
        <div className="qr-code-box" ref={qrRef}>
          <QRCode
            value={text}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            className="qr-code"
          />
        </div>
        <button onClick={downloadQRCode} className="download-button">
          Download
        </button>
      </div>
    </div>
  );
};

export default QRcode;
