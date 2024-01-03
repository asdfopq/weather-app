import styled from "styled-components";
import { useState } from "react";
import axios from "axios";

function App() {
  const API_Key = "1184fd2e8d6c476daed85d07192dd491";

  const [location, setLocation] = useState("");
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_Key}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_Key}`;

  const searchWeather = async (e) => {
    if (e.key === "Enter") {
      try {
        const currentData = await axios({
          method: "get",
          url: currentUrl,
        });

        const forecastData = await axios({
          method: "get",
          url: forecastUrl,
        });

        console.log(currentData);
        setCurrentWeather(currentData);

        console.log(forecastData);
        const dailyForecast = forecastData.data.list.filter((i) =>
          i.dt_txt.includes("12:00:00")
        );
        setForecast(dailyForecast);
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <AppContainer>
      <div className="app">
        <input
          placeholder="Search"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          type="text"
          onKeyDown={searchWeather}
        />
        {Object.keys(currentWeather).length !== 0 && (
          <ResultContainer>
            <div className="city">{currentWeather.data.name}</div>
            <div className="temp">
              {Math.round((currentWeather.data.main.temp - 273.15) * 10) / 10}°C
            </div>
            <div className="sky">{currentWeather.data.weather[0].main}</div>
            <div className="icon">
              <img
                src={`http://openweathermap.org/img/wn/${currentWeather.data.weather[0].icon}@2x.png`}
                alt="날씨 아이콘"
              />
            </div>
          </ResultContainer>
        )}
      </div>
      {forecast && forecast.length > 0 && (
        <ForecastContainer>
          {forecast.map((item, index) => (
            <ForecastItem key={index}>
              <div className="time">{item.dt_txt}</div>
              <div className="temp">
                {Math.round((item.main.temp - 273.15) * 10) / 10}°C
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="날씨 아이콘"
              />
              <div className="sky">{item.weather[0].main}</div>
            </ForecastItem>
          ))}
        </ForecastContainer>
      )}
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  .app {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    border: 1px solid blue;
    padding: 20px;
    width: 320px;
    height: 200px;
    background: #3750cd;
    border-radius: 25px;
  }
  input {
    padding: 16px;
    border: 1px solid #fff;
    border-radius: 16px;
    margin-bottom: 15px;
  }
`;

const ResultContainer = styled.div`
  padding: 10px;
  color: #fff;
  position: relative;

  .city {
    display: inline-block;
    font-weight: 600;
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .temp {
    display: inline-block;
    font-size: 60px;
    margin-top: 8px;
    position: absolute;
    left: 0;
    top: 30px;
  }

  .sky {
    display: inline-block;
    font-size: 22px;
    text-align: center;
    position: absolute;
    right: 50px;
    top: -1px;
  }

  img {
    position: absolute;
    right: 25px;
    top: 30px;
  }
`;

const ForecastContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-top: 20px;
`;

const ForecastItem = styled.div`
  padding: 10px;
  margin: 10px;
  background-color: #3750cd;
  border-radius: 8px;
  color: #fff;
  text-align: center;

  .time {
    font-size: 20px;
  }

  .temp {
    font-size: 24px;
    margin-top: 8px;
  }

  .sky {
    font-size: 18px;
  }
`;
