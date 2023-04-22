import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./gameLinks.css";

function GameLinks() {
  const location = useLocation();
  const [gamelinks, setGameLinks] = useState([]);
  const [info, setInfo] = useState("");
  const [countdown, setCountdown] = useState(`${location?.state.time}`);

  const getStreamLinks = async () => {
    await axios
      .post("http://localhost:1999/gameLinks", {
        url: location.state.url,
      })
      .then((res) => {
        setInfo(res.data.info);
        setGameLinks(res.data.streams);
        console.log(res.data);
      });
  };

  const countDown = () => {
    // get current date
    let date = new Date().toISOString().slice(0, 10);

    // Get time without time zone identifier
    let time = location?.state.time.slice(0, 8);

    let [_time, _modifier] = time.split(" ");
    let [_hours, _minutes] = _time.split(":");
    let _seconds = "00";

    // Converting time to 24h system
    if (_hours === "12") {
      _hours = "00";
    }

    if (_modifier === "pm") {
      _hours = _hours * 1 + 12;
    }

    // getting current time in at UTC
    let now = new Date();
    let utc = now.getTime() + now.getTimezoneOffset() * 60000;
    let utcTime = new Date(utc);

    // getting the time difference between my time and UTC
    let timeDiff;
    if (utcTime.getTime() > now.getTime()) {
      timeDiff = utcTime.getTime() - now.getTime();
    } else if (utcTime.getTime() < now.getTime()) {
      timeDiff = now.getTime() - utcTime.getTime();
    } else {
      timeDiff = 0;
    }

    // added time difference to get game time in user's zone
    let countDownTo =
      new Date(`${date}, ${_hours}:${_minutes}:${_seconds}`).getTime() +
      timeDiff;

    //  Countdown clock to game time
    let x = setInterval(() => {
      let nowT = new Date().getTime();
      let diff = countDownTo - nowT;

      let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );

      //   if hour difference is greater than 12
      if (hours * 1 > 12) {
        setCountdown(location?.state.time);
      }

      //   Indicate game to be live when difference is <= 0
      if (diff <= 0) {
        clearInterval(x);
        setCountdown("LIVE");
      }
    }, 1000);
  };

  useEffect(() => {
    getStreamLinks();
    countDown();
  }, []);

  return (
    <div className="gameLinks">
      <div className="max-width">
        <div className="container">
          <div className="header">
            <div className="league">
              <img src={info?.leagueLogo} alt="" />
              <div className="info">
                <p>{info?.leagueName}</p>
                <span>{info?.date}</span>
              </div>
            </div>

            <div className="teams">
              <div className="left">
                <img src={location.state.team1Logo} alt="" />
                <h2>{location.state.team1}</h2>
              </div>
              <div className="center">
                <span id="countdown">{countdown}</span>
              </div>
              <div className="right">
                <h2>{location.state.team2}</h2>
                <img src={location.state.team2Logo} alt="" />
              </div>
            </div>
          </div>

          <table className="links">
            <tr>
              <th>Streamer</th>
              <th>Link</th>
              <th>Quality</th>
              <th>Ads count</th>
              <th>Language</th>
            </tr>
            {gamelinks.map((link, i) => {
              return (
                <tr key={i}>
                  <td>{link?.name}</td>
                  <td>
                    <Link to={link?.link} target="_blank">
                      {link?.title}
                    </Link>
                  </td>
                  <td>{link?.quality}</td>
                  <td>{link?.ads_count}</td>
                  <td>{link?.language}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}

export default GameLinks;
