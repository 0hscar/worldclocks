import React, { useEffect, useState } from "react";

type City = {
  id: string;
  label: string;
  tz: string;
  utc: string;
};

const cities: City[] = [
  { id: "helsinki", label: "Helsinki", tz: "Europe/Helsinki", utc: "UTC+3" },
  { id: "stockholm", label: "Stockholm", tz: "Europe/Stockholm", utc: "UTC+2" },
  { id: "london", label: "London", tz: "Europe/London", utc: "UTC+1" },
  { id: "newyork", label: "New York", tz: "America/New_York", utc: "UTC-4" },
  { id: "austin", label: "Austin, Texas", tz: "America/Chicago", utc: "UTC-5" },
  {
    id: "losangeles",
    label: "Los Angeles",
    tz: "America/Los_Angeles",
    utc: "UTC-7",
  },
  { id: "bangkok", label: "Bangkok", tz: "Asia/Bangkok", utc: "UTC+7" },
  { id: "tokyo", label: "Tokyo", tz: "Asia/Tokyo", utc: "UTC+9" },
];

// Returns true if DST is in effect for the given timezone
function isDST(tz: string): boolean {
  // Helper to get the timezone offset in minutes for a given date in a given tz
  const getOffset = (date: Date, tz: string) => {
    // Get the UTC time in ms for the date
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    // Get the tz time in ms for the date
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    // Offset in minutes
    return (utcDate.getTime() - tzDate.getTime()) / (60 * 1000);
  };
  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 1);
  // If offset now is different from offset in January, DST is in effect
  return getOffset(now, tz) !== getOffset(jan, tz);
}

// Returns "Summer" or "Winter" for the given timezone
function getSeason(tz: string): string {
  return isDST(tz) ? "Summer" : "Winter";
}

function getTimeString(tz: string) {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz,
  });
}

const App: React.FC = () => {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      for (const city of cities) {
        newTimes[city.id] = getTimeString(city.tz);
      }
      setTimes(newTimes);
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: "#181c20",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginTop: "2rem", marginBottom: "1rem", color: "#e0e6ed" }}>
        World Clock
      </h1>
      <table
        style={{
          background: "#23272f",
          borderRadius: 8,
          boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
          borderCollapse: "collapse",
          marginBottom: "2rem",
          minWidth: 340,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                background: "#23272f",
                color: "#8ecae6",
                fontSize: "1.1em",
                padding: "1rem 2rem",
                textAlign: "left",
                borderBottom: "1px solid #31363f",
              }}
            >
              City
            </th>
            <th
              style={{
                background: "#23272f",
                color: "#8ecae6",
                fontSize: "1.1em",
                padding: "1rem 2rem",
                textAlign: "left",
                borderBottom: "1px solid #31363f",
              }}
            >
              UTC Offset
            </th>
            <th
              style={{
                background: "#23272f",
                color: "#8ecae6",
                fontSize: "1.1em",
                padding: "1rem 2rem",
                textAlign: "left",
                borderBottom: "1px solid #31363f",
              }}
            >
              Local Time
            </th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td
                style={{
                  padding: "1rem 2rem",
                  textAlign: "left",
                  borderBottom: "1px solid #31363f",
                  color: "#e0e6ed",
                }}
              >
                {city.label}
              </td>
              <td
                style={{
                  padding: "1rem 2rem",
                  textAlign: "left",
                  borderBottom: "1px solid #31363f",
                  color: "#e0e6ed",
                }}
              >
                {city.utc} ({getSeason(city.tz)})
              </td>
              <td
                style={{
                  padding: "1rem 2rem",
                  textAlign: "left",
                  borderBottom: "1px solid #31363f",
                  fontFamily: "'Consolas', monospace",
                  fontSize: "1.2em",
                  color: "#8ecae6",
                }}
              >
                {times[city.id] || "--:--:--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer style={{ color: "#5c6773", marginBottom: "1rem" }}>
        Powered by React &amp; TypeScript
      </footer>
    </div>
  );
};

export default App;
