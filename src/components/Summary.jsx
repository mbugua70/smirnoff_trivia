import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { updatePlayer } from "./api";

// Baileys-inspired recommendation data with luxury aesthetic
const recommendationMap = {
  A: {
      title: "Cosmopolitan",
    subtitle: "The Sophisticate",
    lines: [
      "You know what you want,  elegance in a glass. Serve",
    ],
    cta: "Chilled in martini glass, citrus zest garnish",
    icon: "🍽️",
    decorativeIcon: "✦",
  },
  B: {
    title: "Berry Bramble",
    subtitle: "The Playful Spirit",
    lines: [
      "You bring the fun wherever you go. Serve:",
    ],
    cta: "Chilled short glass, fresh berries garnish",
    icon: "🎵",
    decorativeIcon: "♪",
  },
  C: {
    title: " Long Island Iced Tea",
    subtitle: "The Wildcard",
    lines: [
      "You're not afraid to shake things up",
    ],
    cta: "Serve: Chilled highball, mint & lemon garnish.",
    icon: "☕",
    decorativeIcon: "❋",
  },
  // D: {
  //   title: "Your matched Cocktail",
  //   subtitle: "DON MARGARITA",
  //   lines: ["Classic, zesty, and always a crowd-pleaser."],
  //   cta: "👉 Cheers to your DON MARGARITA choice!",
  //   icon: "🍹",
  //   decorativeIcon: "✧",
  // },
};

// Comprehensive theme mapping for each venue
const themes = {
  YAMAS: {
    background: "linear-gradient(180deg, #E8D5C4 0%, #D4C0B0 50%, #E8D5C4 100%)", // nude gradient
    primaryText: "#3d2817", // dark brown
    secondaryText: "#5a4637", // medium brown
    accentColor: "#8B6F47", // darker gold/brown
    borderColor: "#8B6F47",
    cardBackground: "rgba(139, 111, 71, 0.15)",
    buttonBg: "#8B6F47",
    buttonText: "#fff",
    iconCircleBorder: "#8B6F47",
    iconCircleGlow: "rgba(139, 111, 71, 0.3)",
    ornamentColor: "#8B6F47",
    badgeBg: "#8B6F47",
    badgeText: "#fff",
  },
  ONZA: {
    background: "linear-gradient(180deg, #F5F5DC 0%, #E8E8C8 50%, #F5F5DC 100%)", // beige gradient
    primaryText: "#2c1810", // very dark brown
    secondaryText: "#4a3326", // dark brown
    accentColor: "#8B4513", // saddle brown
    borderColor: "#8B4513",
    cardBackground: "rgba(139, 69, 19, 0.12)",
    buttonBg: "#8B4513",
    buttonText: "#fff",
    iconCircleBorder: "#8B4513",
    iconCircleGlow: "rgba(139, 69, 19, 0.3)",
    ornamentColor: "#8B4513",
    badgeBg: "#8B4513",
    badgeText: "#fff",
  },
  RAFAELO: {
    background: "linear-gradient(180deg, #FFB6C1 0%, #FFA0AB 50%, #FFB6C1 100%)", // pink gradient
    primaryText: "#5C1F3D", // dark pink/purple
    secondaryText: "#7D2E54", // medium pink/purple
    accentColor: "#C9356A", // deep pink
    borderColor: "#C9356A",
    cardBackground: "rgba(201, 53, 106, 0.15)",
    buttonBg: "#C9356A",
    buttonText: "#fff",
    iconCircleBorder: "#C9356A",
    iconCircleGlow: "rgba(201, 53, 106, 0.3)",
    ornamentColor: "#C9356A",
    badgeBg: "#C9356A",
    badgeText: "#fff",
  },
  "DON MARGARITA": {
    background: "linear-gradient(180deg, #0a0a0a 0%, #1a1410 50%, #0a0a0a 100%)", // black gradient (original)
    primaryText: "#f5f1e8", // cream
    secondaryText: "rgba(245, 241, 232, 0.9)",
    accentColor: "#CAAF5C", // gold
    borderColor: "#CAAF5C",
    cardBackground: "rgba(245, 241, 232, 0.08)",
    buttonBg: "#CAAF5C",
    buttonText: "#0a0a0a",
    iconCircleBorder: "#CAAF5C",
    iconCircleGlow: "rgba(202, 175, 92, 0.3)",
    ornamentColor: "#CAAF5C",
    badgeBg: "#CAAF5C",
    badgeText: "#0a0a0a",
  },
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
  const rec = recommendationMap[mostChosen] || {};

  // Get current theme based on recommendation
  const currentTheme = themes[rec.subtitle] || themes["DON MARGARITA"];

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
      {/* Decorative floating elements */}
      <div className="decorative-floaters">
        <div className="floater floater-1" style={{ color: currentTheme.ornamentColor }}>
          {rec.decorativeIcon}
        </div>
        <div className="floater floater-2" style={{ color: currentTheme.ornamentColor }}>
          {rec.decorativeIcon}
        </div>
        <div className="floater floater-3" style={{ color: currentTheme.ornamentColor }}>
          {rec.decorativeIcon}
        </div>
        <div className="floater floater-4" style={{ color: currentTheme.ornamentColor }}>
          {rec.decorativeIcon}
        </div>
        <div className="floater floater-5" style={{ color: currentTheme.ornamentColor }}>
          {rec.decorativeIcon}
        </div>
      </div>

      {/* Luxury swirl pattern overlay */}
      <div className="luxury-pattern" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${currentTheme.accentColor} 35px, ${currentTheme.accentColor} 36px), repeating-linear-gradient(-45deg, transparent, transparent 35px, ${currentTheme.accentColor} 35px, ${currentTheme.accentColor} 36px)`
      }}></div>

      <div className="baileys-summary-container">
        {/* Elegant Header Section */}
        <div className="baileys-header animate__animated animate__fadeIn">
          <div className="header-ornament top-ornament" style={{ color: currentTheme.ornamentColor }}>
            ✦ ✦ ✦
          </div>
          <div
            className="icon-circle"
            style={{
              borderColor: currentTheme.iconCircleBorder,
              background: `linear-gradient(135deg, ${currentTheme.accentColor}1A 0%, ${currentTheme.accentColor}0D 100%)`,
              boxShadow: `0 0 30px ${currentTheme.iconCircleGlow}, inset 0 0 30px ${currentTheme.iconCircleGlow}`,
            }}
          >
            <span className="main-icon">{rec.icon}</span>
          </div>
          <h1 className="main-title" style={{ color: currentTheme.primaryText }}>
            Your Perfect Match
          </h1>
          <div className="header-ornament bottom-ornament" style={{ color: currentTheme.ornamentColor }}>
            ✦
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

        {/* Elegant Restart Button */}
        <button
          onClick={handleRestart}
          className={`baileys-restart-btn animate__animated ${
            applyClass ? "animate__pulse" : ""
          }`}
          style={{
            background: currentTheme.buttonBg,
            color: currentTheme.buttonText,
            boxShadow: `0 5px 20px ${currentTheme.iconCircleGlow}, inset 0 -2px 10px rgba(0, 0, 0, 0.2)`,
          }}
        >
          <span className="btn-text">Start New Journey</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default Summary;
