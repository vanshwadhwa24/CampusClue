import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import imageData from "./images.json";
import logo from "./assets/logo_ACM_Footer.png";
import bgImage from "./assets/THAPAR IMAGE.jpg";
import LandingPage from "./LandingPage";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RetroMapZoomKnobs() {
  const map = useMap();
  return (
    <div className="absolute top-3 right-3 z-[1000] bg-[#0b1021]/80 backdrop-blur-md p-2 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 select-none">
      <span className="font-['Silkscreen'] text-[10px] text-slate-400 pl-1 hidden sm:inline">ZOOM</span>
      <button
        type="button"
        onClick={() => map.zoomIn()}
        title="Zoom In (+)"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e293b] hover:bg-[#334155] border-2 border-black shadow-inner flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
      >
        <div className="w-1 h-4 bg-[#38bdf8] rounded-full animate-spin"></div>
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        title="Zoom Out (-)"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e293b] hover:bg-[#334155] border-2 border-black shadow-inner flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
      >
        <div className="w-4 h-1 bg-[#fbbf24] rounded-full animate-spin"></div>
      </button>
    </div>
  );
}

function App() {
  const totalRounds = 9;
  const previewTime = 10000;

  const [gameState, setGameState] = useState("landing"); // 'landing' | 'playing'
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("campusclue_highscore");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(imageData[0]);
  const [guess, setGuess] = useState(null);
  const [distance, setDistance] = useState(null);
  const [roundScore, setRoundScore] = useState(null);
  const [previewMode, setPreviewMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(previewTime / 1000);
  const [isGuessSubmitted, setIsGuessSubmitted] = useState(false);
  const [showPeekModal, setShowPeekModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [roundHistory, setRoundHistory] = useState([]);

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (previewMode || isGuessSubmitted) return;
        const g = [e.latlng.lat, e.latlng.lng];
        setGuess(g);
      },
    });
    return null;
  }

  function startGame() {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsGameOver(false);
    setRound(1);
    setTotalScore(0);
    setImageIndex(0);
    setCurrentImage(imageData[0]);
    setRoundHistory([]);
    setGuess(null);
    setDistance(null);
    setRoundScore(null);
    setPreviewMode(true);
    setTimeLeft(previewTime / 1000);
    setIsGuessSubmitted(false);
    setGameState("playing");
  }

  function nextRound() {
    window.scrollTo({ top: 0, behavior: "instant" });
    const currentRoundScore = roundScore || 0;
    const newTotalScore = totalScore + currentRoundScore;
    setTotalScore(newTotalScore);

    setRoundHistory((prev) => [
      ...prev,
      {
        round,
        distance,
        score: currentRoundScore,
      },
    ]);

    if (round < totalRounds) {
      setRound((prev) => prev + 1);

      setImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % imageData.length;
        setCurrentImage(imageData[nextIndex]);
        return nextIndex;
      });

      setGuess(null);
      setDistance(null);
      setRoundScore(null);
      setPreviewMode(true);
      setTimeLeft(previewTime / 1000);
      setIsGuessSubmitted(false);
    } else {
      setIsGameOver(true);
      if (newTotalScore > highScore) {
        setHighScore(newTotalScore);
        localStorage.setItem("campusclue_highscore", newTotalScore.toString());
      }
    }
  }

  function restartGame() {
    startGame();
  }

  useEffect(() => {
    if (gameState === "playing" && previewMode) {
      setTimeLeft(previewTime / 1000);
      const interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      const timer = setTimeout(() => {
        setPreviewMode(false);
      }, previewTime);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [previewMode, currentImage, gameState]);

  if (gameState === "landing") {
    return <LandingPage onStartGame={startGame} highScore={highScore} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-retro-pixel-gradient text-slate-100 px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-8 font-['Space_Grotesk'] selection:bg-[#f472b6] selection:text-black overflow-x-hidden">
      {/* THAPAR CAMPUS BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={bgImage}
          alt="Thapar Campus Background"
          className="w-full h-full object-cover object-center scale-105 opacity-90 blur-[3px] transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b16]/90 via-[#070b16]/55 to-[#070b16]/70 pointer-events-none"></div>
      </div>

      {/* PEEK PHOTO MODAL */}
      {showPeekModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-spot-fade">
          <div className="relative w-full max-w-4xl lg:max-w-5xl bg-[#0b1021] border-4 sm:border-6 border-black p-4 sm:p-6 rounded-3xl shadow-[12px_12px_0px_0px_#000] flex flex-col items-center gap-4 max-h-[95vh]">
            <div className="w-full flex justify-between items-center border-b-2 border-slate-800 pb-3">
              <span className="font-['Silkscreen'] text-sm sm:text-base text-[#38bdf8] flex items-center gap-2">
                <span>👁️</span> SPOT #{round} PHOTO PEEK
              </span>
              <button
                onClick={() => setShowPeekModal(false)}
                className="px-3 py-1.5 bg-[#f43f5e] hover:bg-[#e11d48] active:scale-95 text-white font-['Silkscreen'] text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg cursor-pointer font-bold transition-all"
              >
                CLOSE [X]
              </button>
            </div>
            <div className="relative w-full h-[62vh] sm:h-[70vh] min-h-[360px] max-h-[720px] overflow-hidden rounded-2xl border-4 border-black bg-[#050811] flex items-center justify-center">
              {/* Soft blurred ambient backdrop to fill frame seamlessly */}
              <img
                src={new URL(currentImage.filename, import.meta.url).href}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-25 blur-xl scale-110 pointer-events-none"
              />
              <img
                src={new URL(currentImage.filename, import.meta.url).href}
                alt="Peek Spot Photo"
                className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] select-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8">
        {/* Header - Glassy Retro Style */}
        <header className="w-full bg-[#0b1021]/60 backdrop-blur-lg border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 sm:p-5 rounded-2xl flex flex-row justify-between items-center gap-3">
          {/* Game Title & Home Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGameState("landing")}
              title="Return to Landing Page"
              className="px-3 py-2 bg-[#1e293b] hover:bg-[#334155] active:scale-95 text-slate-200 font-['Silkscreen'] text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-xl cursor-pointer transition-all uppercase font-bold flex items-center gap-1.5"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">MENU</span>
            </button>
            <h1 className="text-lg sm:text-3xl font-['Press_Start_2P'] tracking-tight drop-shadow-[3px_3px_0px_#000] uppercase">
              <span className="text-[#fbbf24]">CAMPUS</span>{" "}
              <span className="text-[#38bdf8]">CLUE</span>
            </h1>
          </div>

          {/* Right Header HUD: Score, Peek Photo & ACM Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Total Score Badge */}
            <div className="px-3 sm:px-4 py-2 bg-black/70 backdrop-blur-sm border-2 border-black rounded-xl font-['Silkscreen'] text-xs sm:text-sm text-[#fbbf24] shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
              <span>🏆</span>
              <span>SCORE: {totalScore}</span>
            </div>

            {/* Peek Photo Button */}
            {!previewMode && !isGameOver && (
              <button
                onClick={() => setShowPeekModal(true)}
                className="px-3 sm:px-4 py-2 bg-[#38bdf8] hover:bg-[#0284c7] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000] text-black font-['Silkscreen'] text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl cursor-pointer transition-all uppercase font-bold flex items-center gap-1.5"
              >
                <span>👁️</span>
                <span className="hidden sm:inline">PEEK PHOTO</span>
              </button>
            )}

            {/* ACM Thapar Logo Box */}
            <div className="bg-black/70 backdrop-blur-sm border-2 border-black px-3 sm:px-4 py-2 shadow-[3px_3px_0px_0px_#000] rounded-xl flex items-center justify-center">
              <img
                src={logo}
                alt="ACM Thapar Logo"
                className="h-7 sm:h-9 w-auto object-contain [image-rendering:pixelated]"
              />
            </div>
          </div>
        </header>

        {isGameOver ? (
          /* DETAILED FINAL SCOREBOARD SCREEN */
          <div className="w-full max-w-3xl bg-[#0b1021]/75 backdrop-blur-lg border-4 sm:border-6 border-black shadow-[12px_12px_0px_0px_#000] p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-6 text-center animate-spot-fade">
            <div className="space-y-2">
              <span className="font-['Silkscreen'] text-xs sm:text-sm text-[#fbbf24] tracking-widest uppercase">
                🎮 GAME COMPLETED
              </span>
              <h2 className="text-2xl sm:text-4xl font-['Press_Start_2P'] text-[#38bdf8] drop-shadow-[3px_3px_0px_#000] uppercase">
                FINAL SCOREBOARD
              </h2>
            </div>

            {/* Rank Badge & Total Score */}
            <div className="w-full bg-[#060a12]/90 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row justify-around items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-slate-400 font-['Silkscreen'] text-xs">ACCURACY SCORE</span>
                <span className="text-3xl sm:text-4xl font-['Press_Start_2P'] text-[#fbbf24] mt-1">
                  {totalScore}/{totalRounds}
                </span>
              </div>
              <div className="h-10 w-0.5 bg-slate-800 hidden sm:block"></div>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 font-['Silkscreen'] text-xs">NAVIGATOR RANK</span>
                <span className="text-lg sm:text-xl font-['Silkscreen'] text-[#34d399] font-bold mt-1">
                  {totalScore >= 7
                    ? "🏆 CAMPUS MASTER"
                    : totalScore >= 4
                    ? "🎯 CAMPUS EXPLORER"
                    : "📍 NOVICE NAVIGATOR"}
                </span>
              </div>
            </div>

            {/* Detailed Spot Scoring Breakdown Table */}
            <div className="w-full bg-[#060a12]/90 border-3 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] overflow-x-auto">
              <h3 className="font-['Silkscreen'] text-xs sm:text-sm text-[#38bdf8] mb-3 text-left tracking-wider">
                📊 SPOT-BY-SPOT DETAILS
              </h3>
              <table className="w-full text-left font-['Space_Grotesk'] text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-['Silkscreen'] text-xs">
                    <th className="pb-2">SPOT #</th>
                    <th className="pb-2">DISTANCE</th>
                    <th className="pb-2 text-right">POINTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {roundHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-2.5 font-['Silkscreen'] text-xs text-white">
                        Spot #{item.round}
                      </td>
                      <td className="py-2.5 text-slate-300 font-['Silkscreen'] text-xs">
                        {item.distance !== null ? `${item.distance} m` : "Skipped"}
                      </td>
                      <td className="py-2.5 text-right font-['Silkscreen'] font-bold text-xs">
                        {item.score > 0 ? (
                          <span className="text-[#34d399]">+1 PT</span>
                        ) : (
                          <span className="text-slate-500">0 PT</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <button
                onClick={restartGame}
                className="px-8 py-4 bg-[#fbbf24] hover:bg-[#f59e0b] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_#000] text-black font-['Silkscreen'] text-sm sm:text-base border-4 border-black shadow-[6px_6px_0px_0px_#000] cursor-pointer transition-all uppercase font-bold tracking-wider"
              >
                PLAY AGAIN 🔄
              </button>
              <button
                onClick={() => setGameState("landing")}
                className="px-8 py-4 bg-[#38bdf8] hover:bg-[#0284c7] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_#000] text-black font-['Silkscreen'] text-sm sm:text-base border-4 border-black shadow-[6px_6px_0px_0px_#000] cursor-pointer transition-all uppercase font-bold tracking-wider"
              >
                MAIN MENU 🏠
              </button>
            </div>
          </div>
        ) : previewMode ? (
          <div className="relative w-full flex flex-col items-center">
            {/* RETRO TV MONITOR GLASS CONTAINER */}
            <div
              key={round}
              className="relative w-full bg-[#0b1021]/70 backdrop-blur-lg border-4 sm:border-6 border-black shadow-[10px_10px_0px_0px_#000] p-4 sm:p-6 rounded-3xl flex flex-col items-center animate-spot-fade"
            >
              {/* TV Screen Header / Brand Badge */}
              <div className="w-full flex items-center justify-between px-2 pb-3 text-[11px] sm:text-xs font-['Silkscreen'] text-[#38bdf8] tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] animate-pulse"></span>
                  <span>CAMPUS CLUE // TARGET FEED</span>
                </div>
                <span className="text-[#fef08a] bg-black/60 px-3 py-1 rounded-lg border border-black font-bold">
                  SPOT #{round} OF {totalRounds}
                </span>
              </div>

              {/* TV Screen Glass Frame */}
              <div className="relative w-full h-[62vh] sm:h-[70vh] min-h-[420px] max-h-[760px] overflow-hidden rounded-2xl border-4 border-black bg-[#050811] shadow-inner flex items-center justify-center">
                {/* Soft ambient blurred background so portrait/square photos look immersive instead of dead empty space */}
                <img
                  key={`bg-${currentImage.filename}`}
                  src={new URL(currentImage.filename, import.meta.url).href}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-xl scale-110 pointer-events-none"
                />

                {/* Main spot photo: object-contain & centered so it is NEVER cropped */}
                <img
                  key={currentImage.filename}
                  src={new URL(currentImage.filename, import.meta.url).href}
                  alt="Campus Spot"
                  className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center animate-spot-fade select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
                />

                {/* TV Screen Glare */}
                <div className="absolute inset-0 z-20 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none"></div>
              </div>

              {/* TV Control Panel (Knobs & Decreasing Progress Time Bar) */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                {/* Decreasing Progress Bar Badge */}
                <div className="w-full sm:w-80 bg-black/70 backdrop-blur-sm px-4 py-2.5 font-['Silkscreen'] text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                    <span className="text-[#fef08a] font-bold">TIME REMAINING</span>
                    <span className="text-[#38bdf8] font-bold">{timeLeft}s</span>
                  </div>
                  <div className="w-full bg-[#1e293b] h-3 rounded-md overflow-hidden border border-black p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#38bdf8] via-[#fbbf24] to-[#f43f5e] rounded transition-all duration-1000 ease-linear shadow-[0_0_8px_#38bdf8]"
                      style={{ width: `${(timeLeft / (previewTime / 1000)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Decorative Spinning Retro TV Knobs */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1e293b] border-2 border-black shadow-inner flex items-center justify-center cursor-pointer">
                    <div className="w-1 h-3 bg-[#38bdf8] rounded-full animate-spin"></div>
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1e293b] border-2 border-black shadow-inner flex items-center justify-center cursor-pointer">
                    <div className="w-3 h-1 bg-[#fbbf24] rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full bg-[#0b1021]/60 backdrop-blur-lg border-4 sm:border-6 border-black shadow-[10px_10px_0px_0px_#000] p-4 sm:p-6 rounded-3xl flex flex-col gap-4 pb-24 sm:pb-28">
            {/* Top Bar inside Map Card: Round Info & Instructions */}
            <div className="flex flex-wrap gap-3 justify-between items-center font-['Silkscreen'] px-1">
              <span className="px-3.5 py-1.5 bg-[#060a12] border-2 border-black text-[#38bdf8] text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] font-bold tracking-wider rounded-xl">
                Round {round}/{totalRounds}
              </span>
              <span className="text-slate-400 text-[11px] sm:text-xs tracking-wider hidden sm:inline">
                {!guess && !isGuessSubmitted
                  ? "🎯 CLICK MAP TO DROP PIN"
                  : !isGuessSubmitted
                  ? "📍 PIN PLACED - SUBMIT GUESS BELOW"
                  : "🏁 ROUND RESULTS"}
              </span>
              <span className="px-3.5 py-1.5 bg-[#060a12] border-2 border-black text-[#fbbf24] text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] font-bold tracking-wider rounded-xl">
                Total Score: {totalScore}
              </span>
            </div>

            {/* Map Frame */}
            <div className="relative w-full h-[52vh] sm:h-[58vh] min-h-[360px] overflow-hidden rounded-2xl border-4 border-black">
              <MapContainer
                center={[30.354015, 76.367206]}
                zoom={17}
                zoomControl={false}
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapClickHandler />
                <RetroMapZoomKnobs />

                {/* User guess marker - show immediately when user clicks */}
                {guess && <Marker position={guess} />}

                {/* Correct answer marker and polyline - show ONLY after submission */}
                {isGuessSubmitted && (
                  <>
                    <Marker position={[currentImage.lat, currentImage.lng]} />
                    <Polyline
                      positions={[guess, [currentImage.lat, currentImage.lng]]}
                      color="#fef08a"
                    />
                  </>
                )}
              </MapContainer>
            </div>

            {/* IN-VIEWPORT FLOATING CONTROLS (Always on viewport so scrolling is never needed) */}

            {/* Submit button - floating directly on viewport when guess is placed */}
            {guess && !isGuessSubmitted && (
              <div className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-[1001] animate-spot-fade">
                <button
                  onClick={() => {
                    const d = getDistance(
                      guess[0],
                      guess[1],
                      currentImage.lat,
                      currentImage.lng
                    );
                    setDistance(Math.round(d));
                    const score = d <= 50 ? 1 : 0;
                    setRoundScore(score);
                    setIsGuessSubmitted(true);
                  }}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#f472b6] hover:bg-[#ec4899] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_#000] text-black font-['Silkscreen'] text-sm sm:text-base border-4 border-black shadow-[6px_6px_0px_0px_#000] cursor-pointer transition-all uppercase font-bold tracking-wider rounded-2xl flex items-center gap-2.5 whitespace-nowrap"
                >
                  <span>Submit Guess</span>
                  <span>🎯</span>
                </button>
              </div>
            )}

            {/* Results + Next Spot button - floating directly on viewport upon submission */}
            {isGuessSubmitted && (
              <div className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-[1001] bg-[#0b1021]/95 backdrop-blur-xl border-4 border-black shadow-[8px_8px_0px_0px_#000] p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-spot-fade max-w-[94vw]">
                {/* Distance badge */}
                {distance !== null && (
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#060a12] border-2 border-black rounded-xl font-['Silkscreen'] text-xs sm:text-sm">
                    <span className="text-slate-400">DIST:</span>
                    <span className="text-[#38bdf8] font-bold">{distance} m</span>
                  </div>
                )}

                {/* Score badge */}
                {roundScore !== null && (
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#060a12] border-2 border-black rounded-xl font-['Silkscreen'] text-xs sm:text-sm">
                    <span className="text-slate-400">SCORE:</span>
                    {roundScore > 0 ? (
                      <span className="text-[#34d399] font-bold">+1 PT 🎉</span>
                    ) : (
                      <span className="text-[#f43f5e] font-bold">0 PT</span>
                    )}
                  </div>
                )}

                {/* Next Spot / Final Score Button */}
                <button
                  onClick={nextRound}
                  className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-[#5eead4] hover:bg-[#2dd4bf] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_#000] text-black font-['Silkscreen'] text-xs sm:text-sm border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000] cursor-pointer transition-all uppercase font-bold tracking-wider rounded-xl sm:rounded-2xl whitespace-nowrap flex items-center gap-2"
                >
                  <span>{round < totalRounds ? "Next Spot" : "See Final Score"}</span>
                  <span>➜</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;