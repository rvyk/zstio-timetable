import { useTheme } from "next-themes";
import React from "react";
import Snowfall from "react-snowfall";

const SnowSettings: SnowOption = {
  snowflakeCount: 60,
  speed: [4, 6],
  wind: [1, 3],
  radius: [1, 5],
};

function Snow({ isSnowing }: { isSnowing: boolean }) {
  const { theme } = useTheme();

  if (isSnowing && new Date().getMonth() === 11) {
    return (
      <Snowfall
        speed={SnowSettings.speed}
        snowflakeCount={SnowSettings.snowflakeCount}
        radius={SnowSettings.radius}
        wind={SnowSettings.wind}
        color="#fff"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          opacity: theme == "dark" ? 0.7 : 1.0,
        }}
      />
    );
  }
}

export default Snow;
