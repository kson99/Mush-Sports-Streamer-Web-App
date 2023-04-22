import React, { useContext } from "react";
import "./home.css";
import { Link } from "react-router-dom";
import { contentContext } from "../../App";

function Home() {
  const { upcoming } = useContext(contentContext);

  const [upcomingGames] = upcoming;

  return (
    <div className="home">
      <div className="max-width">
        <div className="container">
          {upcomingGames.map((game, index) => {
            return (
              <Link
                key={index}
                to={`/${game.team1.replaceAll(
                  " ",
                  "_"
                )}_VS_${game.team2.replaceAll(" ", "_")}`}
                state={game}
                className="game"
              >
                <div className="left">
                  <img src={game.team1Logo} alt="" />
                  <p>{game.team1}</p>
                </div>
                <div className="center">
                  <div>{game.time}</div>
                  <p>VS</p>
                </div>
                <div className="right">
                  <img src={game.team2Logo} alt="" />
                  <p>{game.team2}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// const styles = StyleSheet

export default Home;
