import React, { useState, useEffect } from "react";

export default function PrivacyPrompt({ onConfirm }) {
  const [showPrompt, setShowPrompt] = useState(true);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem("privacyConfirm");
    if (remembered === "yes") {
      onConfirm(true);
      setShowPrompt(false);
    }
    if (remembered === "no") {
      onConfirm(false);
      setShowPrompt(false);
    }
  }, [onConfirm]);

  const handleAccept = () => {
    onConfirm(true);
    setShowPrompt(false);
    if (remember) localStorage.setItem("privacyConfirm", "yes");
  };

  const handleDecline = () => {
    onConfirm(false);
    setShowPrompt(false);
    if (remember) localStorage.setItem("privacyConfirm", "no");
  };

  if (!showPrompt) return null;

  return (
    <div className="prompt-backdrop">
      <div className="prompt-box">
        <h4>🔒 Privacy Confirmation</h4>
        <p>
          This website would like to store cookies and access your location
          to improve your experience. Do you agree?
        </p>

        <div className="form-check text-start mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberChoice"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="rememberChoice">
            Remember my choice
          </label>
        </div>

        <div className="prompt-actions">
          <button className="btn btn-primary" onClick={handleAccept}>
            Yes, I agree
          </button>
          <button className="btn btn-outline-secondary" onClick={handleDecline}>
            No, thanks
          </button>
        </div>
      </div>

      <style>{`
       .prompt-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.prompt-box {
  background: #fff;
  padding: 80px 60px;  
  border-radius: 20px; 
  width: 1000px;       
  max-width: 95%;        
  box-shadow: 0 12px 40px rgba(0,0,0,.25);
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.prompt-box h4 {
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 700;
}

.prompt-box p {
  font-size: 18px;
  margin-bottom: 15px;
  color: #444;
}

.prompt-actions {
  margin-top: 24px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.prompt-actions .btn {
  font-size: 18px;
  padding: 14px 28px;
  border-radius: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

      `}</style>
    </div>
  );
}
