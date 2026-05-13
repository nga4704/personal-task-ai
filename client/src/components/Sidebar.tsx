import { Link } from "react-router-dom";

export default function Sidebar() {
  const style = { display: "block", margin: "20px 0", textDecoration: "none" };

  return (
    <div style={{ width: 220, background: "#111827", color: "white", padding: 20 }}>
      <h2>TaskAI</h2>

      <Link to="/dashboard" style={style}>Dashboard</Link>
      <Link to="/tasks" style={style}>Tasks</Link>
      <Link to="/smart-schedule" style={style}>Smart Schedule</Link>
      <Link to="/ai-insights" style={style}>AI Insights</Link>
      <Link to="/settings" style={style}>Settings</Link>
    </div>
  );
}