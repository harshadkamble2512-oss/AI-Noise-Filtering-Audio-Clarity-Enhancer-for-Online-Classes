import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";

function MeetingRoom() {
  const { meetingId } = useParams();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [error, setError] = useState("");

  async function startMedia() {
    try {
      setError("");

      if (streamRef.current) {
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
      setMicOn(true);
    } catch (err) {
      setError(
        "Camera or microphone access failed. Check browser permissions."
      );

      console.error(err);
    }
  }

  function toggleMic() {
    const stream = streamRef.current;

    if (!stream) {
      return;
    }

    const nextState = !micOn;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = nextState;
    });

    setMicOn(nextState);
  }

  function toggleCamera() {
    const stream = streamRef.current;

    if (!stream) {
      return;
    }

    const nextState = !cameraOn;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = nextState;
    });

    setCameraOn(nextState);
  }

  function leaveMeeting() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    window.location.href = "/dashboard";
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <div className="meeting-page">
      <header className="meeting-header">
        <div>
          <h2>AI Classroom</h2>
          <p>Meeting ID: {meetingId}</p>
        </div>

        <Link to="/dashboard" className="secondary-button">
          Dashboard
        </Link>
      </header>

      <main className="meeting-content">
        <div className="meeting-title">
          <h1>Online Classroom</h1>
          <p>
            Start your camera and microphone to preview your setup.
          </p>
        </div>

        <div className="video-grid">
          <div className="video-tile">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />

            {!cameraOn && (
              <div className="video-placeholder">
                <div className="avatar">👤</div>
                <p>Your Camera Preview</p>
              </div>
            )}

            <span className="participant-name">You</span>
          </div>

          <div className="video-tile waiting-tile">
            <div className="avatar">👨‍🏫</div>
            <h3>Waiting for participants</h3>
            <p>Other users are not connected yet.</p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="meeting-controls">
          <button
            className="primary-button"
            onClick={startMedia}
            disabled={!!streamRef.current}
          >
            Start Camera & Mic
          </button>

          <button
            className="secondary-button"
            onClick={toggleMic}
            disabled={!streamRef.current}
          >
            {micOn ? "Mute Mic" : "Unmute Mic"}
          </button>

          <button
            className="secondary-button"
            onClick={toggleCamera}
            disabled={!streamRef.current}
          >
            {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
          </button>

          <button
            className="danger-button"
            onClick={leaveMeeting}
          >
            Leave Meeting
          </button>
        </div>

        <div className="audio-notice">
          <strong>AI Audio Enhancement</strong>

          <p>
            The AI audio processing module will be connected in a
            later development stage. It is not active yet.
          </p>
        </div>
      </main>
    </div>
  );
}

export default MeetingRoom;