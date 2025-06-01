import React from "react";
import { useNavigate } from "react-router-dom";

const Highlights = () => {
  const navigate = useNavigate();

  return (
    <div className="highlights-container">
      <h2 className="highlights-title">🎥 Match Highlights</h2>

      <div className="video-card">
        <iframe
          src="https://www.youtube.com/embed/kl3lsihG6Y0"
          title="Match Highlights"
          allowFullScreen
        ></iframe>
        <p>
          <strong>Ball Possession & Goals Recap</strong>
        </p>
      </div>

      <div className="video-card">
        <iframe
          src="https://www.youtube.com/embed/2Zp5BtuCfrA"
          title="Celebration Video"
          allowFullScreen
        ></iframe>
        <p>
          <strong>Celebration Moments</strong>
        </p>
      </div>

      <div className="video-card">
        <iframe
          src="https://www.youtube.com/embed/ZFxCMpK1hRI"
          title="PSG Celebration"
          allowFullScreen
        ></iframe>
        <p>
          <strong>PSG Celebrate Their First Ever Champions League Title</strong>
        </p>
      </div>
    </div>
  );
};

export default Highlights;
