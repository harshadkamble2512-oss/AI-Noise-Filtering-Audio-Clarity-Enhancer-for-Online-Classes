import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  LayoutDashboard,
  Users,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";

function MeetingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [mediaError, setMediaError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isHost =
    meeting?.host?._id === user._id ||
    meeting?.host === user._id;

  // Fetch meeting details from backend
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/meetings/${meetingId}`
        );

        setMeeting(response.data.meeting);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load meeting."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  // Start camera and microphone
  const startMedia = async () => {
    try {
      setMediaError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setMediaError(
          "Camera and microphone are not supported in this browser."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
      setMicOn(true);
    } catch (err) {
      console.error("Media error:", err);

      setMediaError(
        "Camera or microphone permission denied. Please check browser permissions."
      );
    }
  };

  // Camera toggle
  const toggleCamera = () => {
    if (!streamRef.current) return;

    const tracks = streamRef.current.getVideoTracks();

    if (tracks.length === 0) return;

    const nextState = !cameraOn;

    tracks.forEach((track) => {
      track.enabled = nextState;
    });

    setCameraOn(nextState);
  };

  // Microphone toggle
  const toggleMic = () => {
    if (!streamRef.current) return;

    const tracks = streamRef.current.getAudioTracks();

    if (tracks.length === 0) return;

    const nextState = !micOn;

    tracks.forEach((track) => {
      track.enabled = nextState;
    });

    setMicOn(nextState);
  };

  // Stop local media
  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    setMicOn(false);
  };

  // End meeting
  const handleEndMeeting = async () => {
    if (!isHost) {
      stopMedia();
      navigate("/dashboard");
      return;
    }

    try {
      await api.patch(`/meetings/${meetingId}/end`);

      stopMedia();
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to end meeting."
      );
    }
  };

  // Cleanup when leaving the page
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="meeting-state">
        <LoaderCircle className="loading-icon" size={35} />
        <h2>Loading Classroom...</h2>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="meeting-state">
        <h2>Meeting Unavailable</h2>
        <p>{error || "Meeting not found."}</p>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="meeting-page">
      <header className="meeting-header">
        <div className="meeting-brand">
          <Video size={28} />

          <div>
            <h2>AI Classroom</h2>
            <p>{meeting.title}</p>
            <small>Meeting ID: {meeting.meetingCode}</small>
          </div>
        </div>

        <button
          className="dashboard-nav-button"
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
      </header>

      <main className="meeting-main">
        <div className="meeting-heading">
          <h1>Online Classroom</h1>

          <p>
            Start your camera and microphone to preview your setup.
          </p>
        </div>

        {mediaError && (
          <div className="meeting-error">
            {mediaError}
          </div>
        )}

        <div className="meeting-grid">
          <div className="video-card">
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="local-video"
              />
            ) : (
              <div className="video-placeholder">
                <div className="avatar-circle">
                  <Users size={42} />
                </div>

                <h3>Your Camera Preview</h3>
                <p>Camera is currently off</p>
              </div>
            )}

            <span className="video-name">
              {user.name || "You"}
            </span>
          </div>

          <div className="video-card waiting-card">
            <div className="avatar-circle teacher-avatar">
              <Users size={42} />
            </div>

            <h2>Waiting for participants</h2>

            <p>
              Other users are not connected yet.
            </p>

            <div className="participant-count">
              <Users size={17} />
              {meeting.participants?.length || 0} participant(s)
            </div>
          </div>
        </div>

        <div className="meeting-controls">
          {!streamRef.current ? (
            <button
              className="control-button start-button"
              onClick={startMedia}
            >
              <Video size={20} />
              Start Camera & Mic
            </button>
          ) : (
            <>
              <button
                className={`control-button ${
                  cameraOn ? "active-control" : "off-control"
                }`}
                onClick={toggleCamera}
              >
                {cameraOn ? (
                  <Video size={20} />
                ) : (
                  <VideoOff size={20} />
                )}
                {cameraOn ? "Camera On" : "Camera Off"}
              </button>

              <button
                className={`control-button ${
                  micOn ? "active-control" : "off-control"
                }`}
                onClick={toggleMic}
              >
                {micOn ? (
                  <Mic size={20} />
                ) : (
                  <MicOff size={20} />
                )}
                {micOn ? "Mic On" : "Mic Off"}
              </button>
            </>
          )}

          <button
            className="control-button leave-button"
            onClick={handleEndMeeting}
          >
            <PhoneOff size={20} />
            {isHost ? "End Meeting" : "Leave Meeting"}
          </button>
        </div>

        <div className="meeting-information">
          <h3>Meeting Information</h3>

          <p>
            <strong>Title:</strong> {meeting.title}
          </p>

          <p>
            <strong>Meeting Code:</strong>{" "}
            {meeting.meetingCode}
          </p>

          <p>
            <strong>Status:</strong> {meeting.status}
          </p>

          <p>
            <strong>Participants:</strong>{" "}
            {meeting.participants?.length || 0}
          </p>
        </div>
      </main>
    </div>
  );
}

export default MeetingRoom;