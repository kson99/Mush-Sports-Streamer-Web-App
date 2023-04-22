import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./screens/home/home";
import Navbar from "./components/navbar/navbar";
import GameLinks from "./screens/gameLinks/gameLinks";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const contentContext = createContext();

function App() {
  const [upcomingGames, setUpcomingGames] = useState([]);

  const getUpcomingGames = () => {
    axios.get(`http://localhost:1999/upcomingGames`).then((res) => {
      setUpcomingGames(res.data);
    });
  };

  useEffect(() => {
    getUpcomingGames();
  }, []);

  return (
    <contentContext.Provider
      value={{
        upcoming: [upcomingGames, setUpcomingGames],
      }}
    >
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {upcomingGames.map((game, i) => {
            return (
              <Route
                key={i}
                path={
                  game.team1.replaceAll(" ", "_") +
                  "_VS_" +
                  game.team2.replaceAll(" ", "_")
                }
                element={<GameLinks />}
              />
            );
          })}
        </Routes>
      </div>
    </contentContext.Provider>
  );
}

export default App;
