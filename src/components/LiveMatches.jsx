import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ToggleLeft, ToggleRight, Music, AudioLines } from "lucide-react";
import axios from "axios";

import championsLogo from "../assets/img/champions-league.jpeg";
import championsBdg from "../assets/img/video5895433549720328973.mp4";
import backgroundMusicFile from "../assets/audio/UEFA Champions League Anthem.mp3";

const headers = {
  "x-rapidapi-key": "20b2ec2224mshc5b95c57bbbd053p192725jsna1147872b2c2",
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
};

const FinalMatch = () => {
  const [match, setMatch] = useState(null);
  const [stats, setStats] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [lineups, setLineups] = useState([]);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const audioRef = useRef(null);

  const fixtureDate = "2025-05-31";
  const [timeLeft, setTimeLeft] = useState("");
  const [showVideo, setShowVideo] = useState(true);
  const [showHighlights, setShowHighlights] = useState(false);

  // Attempt to play audio on load; if blocked, show overlay for user interaction
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.log("Autoplay prevented:", e);
        setMusicPlaying(false);
        setShowOverlay(true);
      });
    }
  }, []);

  // Hide video after 20 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowVideo(false);
    }, 20000);

    return () => clearTimeout(timeout);
  }, []);

  // Countdown to kickoff
  useEffect(() => {
    const kickoffTime = new Date("2025-05-31T19:00:00Z");

    const interval = setInterval(() => {
      const now = new Date();
      const diff = kickoffTime - now;

      if (diff <= 0) {
        setTimeLeft("Kickoff time!");
        clearInterval(interval);
        return;
      }

      const hrs = Math.floor(diff / 1000 / 60 / 60);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch match data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures",
          {
            params: { league: "2", season: "2024", date: fixtureDate },
            headers,
          }
        );

        const fixture = res.data.response[0];
        if (!fixture) {
          setError("No match found for the Champions League Final.");
          return;
        }

        setMatch(fixture);
        const fixtureId = fixture.fixture.id;

        // Stats
        const statsRes = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",
          { params: { fixture: fixtureId }, headers }
        );
        setStats(statsRes.data.response);

        // Events (Goals)
        const eventsRes = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures/events",
          { params: { fixture: fixtureId }, headers }
        );
        setScorers(eventsRes.data.response.filter((e) => e.type === "Goal"));

        // Lineups
        const lineupRes = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups",
          { params: { fixture: fixtureId }, headers }
        );
        setLineups(lineupRes.data.response);
      } catch (err) {
        console.error(err);
        setError("Error loading match data.");
      }
    };

    fetchData();
  }, [fixtureDate]);

  // Handle user interaction from overlay to enable audio
  const handleUserInteraction = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setMusicPlaying(true);
      setShowOverlay(false);
    } catch (e) {
      console.log("User interaction audio play failed:", e);
      setMusicPlaying(false);
      setShowOverlay(true);
    }
  };

  // Toggle music play/pause
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch((e) => {
          console.log("Play prevented:", e);
          setShowOverlay(true);
          setMusicPlaying(false);
        });
    }
  };

  if (error) return <div className="centered">{error}</div>;
  if (!match)
    return <div className="centered">Loading Champions League Final...</div>;

  return (
    <>
      {/* Background video or fallback image */}
      {showVideo ? (
        <video autoPlay muted loop className="background-video">
          <source src={championsBdg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="background-image" />
      )}

      {/* Overlay shown when audio autoplay is blocked */}
      {showOverlay && (
        <div
          onClick={handleUserInteraction}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            textAlign: "center",
            padding: "1rem",
            zIndex: 2000,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          Click anywhere to enable sound
        </div>
      )}

      <div className={`centered ${darkMode ? "dark-theme" : "light-theme"}`}>
        {/* Theme toggle icon */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          className="toggle-icon"
          title="Toggle Theme"
          style={{ cursor: "pointer" }}
        >
          {darkMode ? <ToggleLeft size={32} /> : <ToggleRight size={32} />}
        </div>

        {/* Music toggle icon */}
        <div
          onClick={toggleMusic}
          className="music-toggle-icon"
          title={musicPlaying ? "Pause Music" : "Play Music"}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          {musicPlaying ? <Music size={32} /> : <AudioLines size={32} />}
        </div>

        {/* Audio element */}
        <audio ref={audioRef} src={backgroundMusicFile} loop preload="auto" />

        <h1 style={{ color: "gold" }}>🏆 Champions League Final</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <div className="team-des">
            <div style={{ textAlign: "center" }}>
              <img src={match.teams.home.logo} alt="Home logo" width="50" />
              <p>{match.teams.home.name}</p>
            </div>
            <span style={{ fontSize: "1.5rem" }}>vs</span>
            <div style={{ textAlign: "center" }}>
              <img src={match.teams.away.logo} alt="Away logo" width="50" />
              <p>{match.teams.away.name}</p>
            </div>
          </div>
        </div>
        <p>⏳ Kickoff Countdown: {timeLeft}</p>
        <Link to="/highlights" className="highlights-link">
          <button
            onClick={() => setShowHighlights(!showHighlights)}
            style={{
              margin: "20px auto",
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#123efe",
              color: "gold",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "block",
            }}
          >
            🎥Show Highlights
          </button>
        </Link>
        <p>Kickoff: {new Date(match.fixture.date).toLocaleString()}</p>
        <p>
          Score: {match.goals.home} - {match.goals.away}
        </p>
        <p>Status: {match.fixture.status.long}</p>
        <div className="card right-card">
          <h3>⚽ Goal Scorers</h3>
          {scorers.length ? (
            scorers.map((goal, i) => (
              <p key={i}>
                {goal.time.elapsed}' – {goal.player.name} ({goal.team.name})
              </p>
            ))
          ) : (
            <p>No goals yet</p>
          )}
        </div>
        <div className="card center-card">
          <h3>📊 Possession</h3>
          {stats.map((team) => {
            const poss = team.statistics.find(
              (s) => s.type === "Ball Possession"
            );
            return (
              <p key={team.team.id}>
                {team.team.name}: {poss?.value || "N/A"}
              </p>
            );
          })}
        </div>
        <div className="card left-card">
          <h3>👥 Lineups</h3>
          {lineups.map((lineup) => (
            <div key={lineup.team.id}>
              <h4>{lineup.team.name}</h4>
              <ul>
                {lineup.startXI.map((player) => (
                  <li key={player.player.id}>{player.player.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FinalMatch;
