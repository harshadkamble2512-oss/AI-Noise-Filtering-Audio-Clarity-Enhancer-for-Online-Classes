import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Plus,
  LogIn,
  Copy,
  BookOpen,
  Users,
  Clock,
  Sparkles,
  LogOut,
} from "lucide-react";

import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingCode, setMeetingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdMeeting, setCreatedMeeting] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isTeacher = user.role === "teacher";

  // Create Meeting
  const handleCreateMeeting = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/meetings", {
        title: meetingTitle,
      });

      const meeting = response.data.meeting;

      setCreatedMeeting(meeting);
      setMessage("Meeting created successfully!");
      setMeetingTitle("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create meeting. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Join Meeting
  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    if (!meetingCode.trim()) {
      setError("Please enter meeting code.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        `/meetings/join/${meetingCode.trim()}`
      );

      const meeting = response.data.meeting;

      navigate(`/meeting/${meeting.meetingCode}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to join meeting."
      );
    } finally {
      setLoading(false);
    }
  };

  // Copy Meeting Code
  const copyMeetingCode = async () => {
    if (!createdMeeting?.meetingCode) return;

    try {
      await navigator.clipboard.writeText(
        createdMeeting.meetingCode
      );
      setMessage("Meeting code copied!");
    } catch {
      setError("Unable to copy meeting code.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-icon">
            <Video size={25} />
          </div>

          <div>
            <h2>AI Classroom</h2>
            <p>Smart Online Learning Platform</p>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-label">
              <Sparkles size={15} /> AI POWERED LEARNING
            </span>

            <h1>
              Welcome back,{" "}
              {user.name || "User"}!
            </h1>

            <p>
              Start a new class or join an existing online classroom.
            </p>
          </div>
        </section>

        {error && (
          <div className="dashboard-alert error-alert">
            {error}
          </div>
        )}

        {message && (
          <div className="dashboard-alert success-alert">
            {message}
          </div>
        )}

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="stat-icon">
              <BookOpen />
            </div>
            <div>
              <h3>Online Learning</h3>
              <p>Learn from anywhere</p>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">
              <Users />
            </div>
            <div>
              <h3>Virtual Classroom</h3>
              <p>Connect with participants</p>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">
              <Clock />
            </div>
            <div>
              <h3>Real-time Classes</h3>
              <p>Online meeting management</p>
            </div>
          </div>
        </section>

        <section className="meeting-actions">
          {isTeacher && (
            <div className="meeting-action-card">
              <div className="action-icon">
                <Plus size={27} />
              </div>

              <h2>Create New Meeting</h2>

              <p>
                Create an online classroom and invite your students.
              </p>

              <form onSubmit={handleCreateMeeting}>
                <input
                  type="text"
                  placeholder="Enter meeting title"
                  value={meetingTitle}
                  onChange={(e) =>
                    setMeetingTitle(e.target.value)
                  }
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="primary-action-button"
                >
                  {loading ? "Creating..." : "Create Meeting"}
                </button>
              </form>

              {createdMeeting && (
                <div className="created-meeting">
                  <p>Your Meeting Code</p>

                  <div className="meeting-code-display">
                    <strong>
                      {createdMeeting.meetingCode}
                    </strong>

                    <button
                      type="button"
                      onClick={copyMeetingCode}
                      title="Copy meeting code"
                    >
                      <Copy size={18} />
                    </button>
                  </div>

                  <button
                    className="primary-action-button"
                    onClick={() =>
                      navigate(
                        `/meeting/${createdMeeting.meetingCode}`
                      )
                    }
                  >
                    Enter Classroom
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="meeting-action-card">
            <div className="action-icon">
              <LogIn size={27} />
            </div>

            <h2>Join Meeting</h2>

            <p>
              Enter the meeting code shared by your teacher.
            </p>

            <form onSubmit={handleJoinMeeting}>
              <input
                type="text"
                placeholder="Enter meeting code"
                value={meetingCode}
                onChange={(e) =>
                  setMeetingCode(e.target.value)
                }
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="primary-action-button"
              >
                {loading ? "Joining..." : "Join Classroom"}
              </button>
            </form>
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>
            AI Classroom © 2026 | Intelligent Online Learning
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;