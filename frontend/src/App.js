// frontend/src/App.js
import React, { useState, useEffect } from "react";
import ActivityForm from "./components/ActivityForm";
import Summary from "./components/Summary";
import Chatbot from "./components/Chatbot";

import "./App.css";

function App() {
  const [activitiesUpdated, setActivitiesUpdated] = useState(0);
  const [showWalkReminder, setShowWalkReminder] = useState(false);

  
  useEffect(() => {
    const checkWalkReminder = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (currentHour >= 18 && currentMinute >= 0) {
        setShowWalkReminder(true);
      }
    };

    checkWalkReminder();

    const interval = setInterval(checkWalkReminder, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleActivityAdded = (newActivity) => {
    setActivitiesUpdated((prev) => prev + 1);

    if (newActivity.type === "walk") {
      setShowWalkReminder(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐾 Pet Activity Tracker</h1>
      </header>

      <main className="App-main">
        {showWalkReminder && (
          <div className="walk-reminder">
            ⚠️ Your pet still needs exercise today!
          </div>
        )}

        <ActivityForm onActivityAdded={handleActivityAdded} />
        <Summary key={activitiesUpdated} />

        <div className="chatbot-section">
          <h2>Ask about your pet's activities</h2>
          <Chatbot />
        </div>
      </main>
    </div>
  );
}

export default App;
