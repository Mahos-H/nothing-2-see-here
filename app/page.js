'use client';

import { useState, useRef, useEffect } from 'react';

// 1. Define all 3 videos independently
const ALL_VIDEOS = [
  "/s.mp4",
  "/y.mp4",
  "/e.mp4",
  "/g.mp4"
];

// 2. Define all 3 texts independently
const ALL_TEXTS = [
  "The early bird gets the worm, but the second mouse gets the cheese.",
  "Life is what happens when you're busy making other plans.",
  "Fine morning we are having here, aren't we?",
  "You didn’t really think I wouldn’t find out, did you?",
  "Funny how things always come back around, isn’t it?",
  "You talk big for someone in your position, don’t you?",
  "We both know how this ends, don’t we?",
  "You call that a plan, do you?",
  "Bit late to start worrying now, isn’t it?",
  "You really thought you could get away with it, did you?",
  "You’ve got some nerve showing up here, haven’t you?",
  "Still think you’re in control, do you?",
  "You wouldn’t be hiding something from me… would you?",
  "You always did like playing with fire, didn’t you?",
  "I warned you this would happen, didn’t I?",
  "That’s your best excuse, is it?",
  "You think luck’s on your side tonight, do you?",
  "You’re not as clever as you think you are, are you?"
];

export default function Home() {
  const videoRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const [showPopup, setShowPopup] = useState(true);
  
  // State to hold the time-based selected content
  const [selectedContent, setSelectedContent] = useState({
    popupText: "",
    videoSrc: "",
  });

  // --- Time-based selection logic runs once on component mount ---
  useEffect(() => {
    // 1. Get the current time as a numerical timestamp (milliseconds since epoch)
    const currentTime = new Date().getTime();
    
    // 2. Convert the timestamp to an integer and use the modulo operator (%) 
    // to get a valid index for the content arrays.
    
    // Determine the video index:
    // 1. Generate a uniform random number between 0 and 1
    const randomNum = Math.random(); // uniform distribution in [0, 1)

    // 2. If randomNum < 0.5, always pick "s.mp4"; otherwise use time-based selection
    let videoIndex;
    if (randomNum < 0.9) {
      videoIndex = ALL_VIDEOS.indexOf("/y.mp4"); // or simply 0 if s.mp4 is first
    } else {
      videoIndex = currentTime % ALL_VIDEOS.length;
    }


    const currentSeconds = Math.floor(currentTime / 1000); 
    const textIndex = currentSeconds % ALL_TEXTS.length;

    // 3. Store the time-based content in state
    setSelectedContent({
        popupText: ALL_TEXTS[textIndex],
        videoSrc: ALL_VIDEOS[videoIndex],
    });
    
  }, []); // Runs only once on load

  const handleYesClick = () => {
    setShowPopup(false); // Hides the popup
    
    if (videoRef.current && selectedContent.videoSrc) {
      // Set the deferred video source from the state
      videoRef.current.src = selectedContent.videoSrc;

      // Load and Play the video
      videoRef.current.load();
      setIsMuted(false); 
      videoRef.current.play().catch(error => {
        console.log("Play was prevented:", error);
      });
    }
  };

  return (
    <div className="container">
      
      {/* Video Container: Source is initially empty */}
      <video
        ref={videoRef}
        loop
        muted={isMuted}
        playsInline
        className="video-background"
      >
        Your browser does not support the video tag.
      </video>

      {/* Modal Overlay and Popup */}
      {showPopup && (
        <>
          <div className="modal-overlay"></div>
          
          <div className="popup-container">
            <div className="popup-content">
              {/* Display the time-based selected text */}
              <p className="popup-text">
                {selectedContent.popupText}
              </p>
              <button
                onClick={handleYesClick}
                className="popup-button"
              >
                Yes
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- CSS STYLES --- */}
      <style jsx global>{`
        /* Global Reset or Base Styles (Optional, but good practice) */
        html, body, #__next {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
      
      <style jsx>{`
        /* --- Component-Specific CSS --- */
        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #000;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7); 
          z-index: 100; 
        }

        .popup-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 101; 
        }

        .popup-content {
          background-color: #fff;
          border-radius: 16px; 
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          padding: 32px;
          border: 4px solid #a855f7; 
          max-width: 400px;
          width: 90%;
          text-align: center;
        }

        .popup-text {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937; 
          margin-bottom: 24px;
        }

        .popup-button {
          width: 100%;
          background-color: #8b5cf6; 
          color: white;
          font-weight: bold;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .popup-button:hover {
          background-color: #7c3aed; 
        }
      `}</style>
    </div>
  );
}