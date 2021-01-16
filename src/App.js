// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    setLoading(false);
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="App">
  //       <div class="d-flex justify-content-center mt-5">
  //         <div class="spinner-border" role="status">
  //           <span class="visually-hidden">Loading...</span>
  //         </div>
  //       </div>
  //       <div
  //         style={{ textAlign: "center", marginTop: "50px", fontSize: "50px" }}
  //       >
  //         The model is currently loading (this may take 10 seconds)
  //       </div>
  //     </div>
  //   );
  // }

  // console.log(window.innerWidth);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          <>
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "50px",
                fontSize: "50px",
              }}
            >
              The model is currently loading (this may take 10 seconds)
            </div>{" "}
          </>
        ) : (
          <>
            <Webcam
              ref={webcamRef}
              muted={true}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: `${window.innerWidth < 640 ? "100%" : 640}`,
                height: `${window.innerWidth < 480 ? "auto" : 480}`,
              }}
            />

            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 8,
                width: `${window.innerWidth < 640 ? "100%" : 640}`,
                height: `${window.innerWidth < 480 ? "auto" : 480}`,
              }}
            />
          </>
        )}
      </header>
    </div>
  );
}

export default App;
