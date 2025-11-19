import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { updatePlayer } from "./api";

// General recommendation data for all brands
const recommendationMap = {
  A: {
    title: "The Groove Lover",
    subtitle: "Music & Vibes",
    lines: [
      "You're all about the energy and rhythm of the night.",
    ],
    cta: "Perfect for: Live music venues and cocktail lounges",
    icon: "🎵",
    decorativeIcon: "✦",
  },
  B: {
    title: "The Indulgent Diner",
    subtitle: "Fine Dining Experience",
    lines: [
      "You appreciate the finer things in life.",
    ],
    cta: "Perfect for: Premium dining and culinary adventures",
    icon: "🍽️",
    decorativeIcon: "♪",
  },
  C: {
    title: "The Chill Connoisseur",
    subtitle: "Relaxed & Refined",
    lines: [
      "You know how to enjoy life's simple pleasures.",
    ],
    cta: "Perfect for: Cozy cafes and artisanal experiences",
    icon: "☕",
    decorativeIcon: "❋",
  },
  D: {
    title: "The Social Butterfly",
    subtitle: "Life of the Party",
    lines: [
      "You bring people together and create memories.",
    ],
    cta: "Perfect for: Social gatherings and celebrations",
    icon: "🎉",
    decorativeIcon: "★",
  },
};

// Multi-brand theme blending Smirnoff (red), Gilbey's (purple), and Captain Morgan (cyan)
const multiBrandTheme = {
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a14 20%, #0f0a1a 40%, #0a141a 60%, #140a12 80%, #0a0a0a 100%)",
  primaryText: "#ffffff",
  secondaryText: "rgba(255, 255, 255, 0.9)",
  accentColor: "#ff4d5a", // Smirnoff red as primary accent
  accentColor2: "#b370ff", // Gilbey's purple as secondary
  accentColor3: "#5dd9ff", // Captain Morgan cyan as tertiary
  borderColor: "linear-gradient(120deg, #e22e36 0%, #8a2be2 50%, #00bfff 100%)",
  cardBackground: "rgba(255, 77, 90, 0.05)",
  buttonBg: "linear-gradient(135deg, #e22e36 0%, #8a2be2 50%, #00bfff 100%)",
  buttonText: "#ffffff",
  iconCircleBorder: "#ff4d5a",
  iconCircleGlow: "rgba(255, 77, 90, 0.3)",
  ornamentColor: "#ff4d5a",
  badgeBg: "linear-gradient(135deg, #e22e36 0%, #8a2be2 50%, #00bfff 100%)",
  badgeText: "#ffffff",
};

const Summary = ({ userAnswers, QUESTIONS, setRec }) => {
  const [updateScore, setUpdateScore] = useState({});
  const [applyClass, setApplyClass] = useState(false);

  const navigate = useNavigate();

  // Count skipped answers (unused visually but kept for stats)
  const skippedAnswers = userAnswers.filter((a) => a === null);

  // Count categories A-D
  const choiceCount = { A: 0, B: 0, C: 0, D: 0 };
  const labels = ["A", "B", "C", "D"];
  userAnswers.forEach((ans, i) => {
    if (ans !== null) {
      const idx = QUESTIONS[i].answers.findIndex((opt) => opt === ans);
      if (idx !== -1) choiceCount[labels[idx]]++;
    }
  });

  const mostChosen = Object.keys(choiceCount).reduce((a, b) =>
    choiceCount[a] > choiceCount[b] ? a : b
  );

  // Send update once per category change
  useEffect(() => {
    async function updateFun() {
      const res = await updatePlayer({ score: mostChosen });
      setUpdateScore(res);
    }
    updateFun();
  }, [mostChosen]);

  // Heartbeat animation toggle
  useEffect(() => {
    const interval = setInterval(() => setApplyClass((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  // Pick recommendation data
  const rec = recommendationMap[mostChosen] || recommendationMap.A;

  // Use multi-brand theme for all results
  const currentTheme = multiBrandTheme;

  useEffect(() => {
    setRec(rec);
  }, [rec]);

  function handleRestart() {
    navigate("/");
  }

  return (
    <div
      className="baileys-summary-wrapper"
      style={{ background: currentTheme.background }}
    >
      {/* Elegant floating particles */}
      <div className="smirnoff-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className="baileys-summary-container">
        {/* Header Section */}
        <div className="baileys-header animate__animated animate__fadeIn">
          <div
            className="icon-circle"
            style={{
              borderColor: currentTheme.iconCircleBorder,
              background: `linear-gradient(135deg, ${currentTheme.accentColor}1A 0%, ${currentTheme.accentColor}0D 100%)`,
              boxShadow: `0 0 40px ${currentTheme.iconCircleGlow}, 0 0 80px ${currentTheme.iconCircleGlow}, inset 0 0 30px ${currentTheme.iconCircleGlow}`,
            }}
          >
            <span className="main-icon">{rec.icon}</span>
          </div>
          <h1 className="main-title" style={{ color: currentTheme.primaryText }}>
            Your Perfect Match
          </h1>
          <div className="header-ornament bottom-ornament" style={{ color: currentTheme.ornamentColor }}>
            ✦ ✦ ✦
          </div>
        </div>

        {/* Luxury Result Card */}
        <div
          className="baileys-result-card animate__animated animate__fadeInUp"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.cardBackground} 0%, ${currentTheme.accentColor}0D 100%)`,
            borderColor: currentTheme.borderColor,
            boxShadow: `0 10px 50px rgba(0, 0, 0, 0.3), 0 0 80px ${currentTheme.iconCircleGlow}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
          }}
        >
          <div className="card-ornament top-left" style={{ color: currentTheme.ornamentColor }}>
            ⟡
          </div>
          <div className="card-ornament top-right" style={{ color: currentTheme.ornamentColor }}>
            ⟡
          </div>
          <div className="card-ornament bottom-left" style={{ color: currentTheme.ornamentColor }}>
            ⟡
          </div>
          <div className="card-ornament bottom-right" style={{ color: currentTheme.ornamentColor }}>
            ⟡
          </div>

          <div className="card-inner">
            {/* Match Badge */}
            <div
              className="match-badge"
              style={{
                background: currentTheme.badgeBg,
                color: currentTheme.badgeText,
                boxShadow: `0 5px 20px ${currentTheme.iconCircleGlow}`,
              }}
            >
              <span className="badge-text">Match</span>
              <span className="badge-category">{mostChosen}</span>
            </div>

            {/* Title Section */}
            <div className="title-section">
              <h2 className="persona-title" style={{ color: currentTheme.primaryText }}>
                {rec.title}
              </h2>
              <div
                className="divider-line"
                style={{
                  background: `linear-gradient(90deg, transparent, ${currentTheme.accentColor}, transparent)`,
                }}
              ></div>
              <h3
                className="location-subtitle"
                style={{
                  color: currentTheme.accentColor,
                  textShadow: `0 0 20px ${currentTheme.iconCircleGlow}`,
                }}
              >
                {rec.subtitle}
              </h3>
            </div>

            {/* Description */}
            <div className="description-section">
              {rec.lines.map((line, idx) => (
                <p
                  key={idx}
                  className="description-text animate__animated animate__fadeIn"
                  style={{
                    animationDelay: `${0.3 + idx * 0.15}s`,
                    color: currentTheme.secondaryText,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* CTA Box */}
            <div
              className="reward-box"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.cardBackground} 0%, ${currentTheme.accentColor}0D 100%)`,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="reward-icon">🎁</div>
              <div className="reward-content">
                <p className="reward-label" style={{ color: currentTheme.accentColor }}>
                  Your Exclusive Offer
                </p>
                <p className="reward-text" style={{ color: currentTheme.primaryText }}>
                  {rec.cta}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div
              className="summary-stats"
              style={{
                borderTop: `1px solid ${currentTheme.accentColor}4D`,
              }}
            >
              <div className="stat">
                <span
                  className="stat-number"
                  style={{
                    color: currentTheme.accentColor,
                    textShadow: `0 0 20px ${currentTheme.iconCircleGlow}`,
                  }}
                >
                  {mostChosen}
                </span>
                <span className="stat-text" style={{ color: currentTheme.secondaryText }}>
                  Your Match
                </span>
              </div>
              <div className="stats-divider" style={{ color: `${currentTheme.accentColor}4D` }}>
                |
              </div>
              <div className="stat">
                <span
                  className="stat-number"
                  style={{
                    color: currentTheme.accentColor,
                    textShadow: `0 0 20px ${currentTheme.iconCircleGlow}`,
                  }}
                >
                  {userAnswers.length}
                </span>
                <span className="stat-text" style={{ color: currentTheme.secondaryText }}>
                  Questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Smirnoff Restart Button */}
        <button
          onClick={handleRestart}
          className={`baileys-restart-btn animate__animated ${
            applyClass ? "animate__pulse" : ""
          }`}
          style={{
            background: currentTheme.buttonBg,
            color: currentTheme.buttonText,
            boxShadow: `0 10px 40px ${currentTheme.iconCircleGlow}, 0 0 60px ${currentTheme.iconCircleGlow}, inset 0 2px 0 rgba(255, 255, 255, 0.2)`,
          }}
        >
          <span className="btn-text">Take Quiz Again</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default Summary;
