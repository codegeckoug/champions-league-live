import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LiveMatches from "./components/LiveMatches";

import Highlights from "./pages/HighLights";
import "./global.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage - Live Matches */}
        <Route path="/" element={<LiveMatches />} />

        {/* Highlights Page */}
        <Route path="/highlights" element={<Highlights />} />
      </Routes>
    </Router>
  );
}

export default App;
