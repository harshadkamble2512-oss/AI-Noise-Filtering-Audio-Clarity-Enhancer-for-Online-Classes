import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [meetingCode, setMeetingCode] = useState("");

  function createMeeting() {
    const meetingId = crypto.randomUUID().slice(0, 8);

    navigate(`/meeting/${meetingId}`);
  }

  function joinMeeting(event) {
    event.preventDefault();

    const code = meetingCode.trim();

    if (!code) {
      alert("Please enter a meeting code.");
      return;
    }

    navigate(`/meeting/${encodeURIComponent(code)}`);
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h2>AI Classroom</h2>
        <button
          className="secondary-button"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </header>

      <main className="dashboard-content">
        <span className="badge">YOUR CLASSROOM</span>

        <h1>Welcome to your Dashboard</h1>

        <p>
          Create a class or enter a meeting code to join a class.
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="feature-icon">🎓</div>

            <h2>Create a Class</h2>

            <p>
              Start a new online classroom for your students.
            </p>

            <button
              className="primary-button"
              onClick={createMeeting}
            >
              Create Meeting
            </button>
          </div>

          <div className="dashboard-card">
            <div className="feature-icon">🔗</div>

            <h2>Join a Class</h2>

            <p>
              Enter the meeting code provided by your teacher.
            </p>

            <form onSubmit={joinMeeting}>
              <input
                value={meetingCode}
                onChange={(event) =>
                  setMeetingCode(event.target.value)
                }
                placeholder="Enter meeting code"
                required
              />

              <button
                type="submit"
                className="primary-button full-width"
              >
                Join Meeting
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;