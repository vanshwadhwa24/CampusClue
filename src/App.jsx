import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import imageData from "./images.json";
import logo from "./assets/logo_ACM_Footer.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function App() {
  const totalRounds = 9;
  const previewTime = 10000;

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
        if (previewMode || isGuessSubmitted) return; // Prevent clicking after submission
        const g = [e.latlng.lat, e.latlng.lng];
        setGuess(g);
      },
    });
    return null;
  }

  function nextRound() {
    setTotalScore((prev) => prev + (roundScore || 0));

    if (round < totalRounds) {
      setRound(round + 1);

      setImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % imageData.length;
        setCurrentImage(imageData[nextIndex]);
        return nextIndex;
      });
    } else {
      alert(`Game Over!\nYour Final Score: ${totalScore + (roundScore || 0)}`);
      setRound(1);
      setTotalScore(0);
      setImageIndex(0);
      setCurrentImage(imageData[0]);
    }

    // Reset all round-specific states
    setGuess(null);
    setDistance(null);
    setRoundScore(null);
    setPreviewMode(true);
    setTimeLeft(previewTime / 1000);
    setIsGuessSubmitted(false); // Reset submission state
  }

  useEffect(() => {
    if (previewMode) {
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
  }, [previewMode, currentImage]);

  return (
    <div className="min-h-screen w-full bg-[#1e1c1c] px-6 py-10 flex flex-col items-center gap-8 font-sans">
      <div className="flex justify-between w-full">
        <div className="text-4xl font-extrabold text-[#15a6dd] ">
          Campus Clue
        </div>
        <div className="w-40">
          <img src={logo} alt="acm" />
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center gap-10">
        {previewMode ? (
          <div className="relative w-full max-w-4xl flex flex-col items-center transition-all duration-700">
            <img
              src={new URL(currentImage.filename, import.meta.url).href}
              alt="Campus Spot"
              className="w-220 h-150 object-contain rounded-[2rem] shadow-2xl border-4 border-white/80"
            />
            <div className="absolute -bottom-6 bg-white/80 backdrop-blur-md text-gray-900 px-6 py-3 rounded-full text-xl font-medium shadow-md">
              Start Guessing in <b>{timeLeft}s</b>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl bg-[#2c2c2c] border-5 border-[#15a6dd] backdrop-blur-xl rounded-[2rem] shadow-xl p-6">
            <MapContainer
              center={[30.354015, 76.367206]}
              zoom={17}
              className="w-full h-[60vh] rounded-[1.5rem] overflow-hidden"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapClickHandler />
              
              {/* User guess marker - show immediately when user clicks */}
              {guess && <Marker position={guess} />}
              
              {/* Correct answer marker and polyline - show ONLY after submission */}
              {isGuessSubmitted && (
                <>
                  <Marker position={[currentImage.lat, currentImage.lng]} />
                  <Polyline
                    positions={[guess, [currentImage.lat, currentImage.lng]]}
                    color="#2563eb"
                  />
                </>
              )}
            </MapContainer>

            <div className="flex flex-wrap gap-4 mt-6 justify-between">
              <span className="px-4 py-2 bg-[#8ad9f1] rounded-xl text-[#1e1c1c] font-semibold">
                Round {round}/{totalRounds}
              </span>
              <span className="px-4 py-2 bg-[#8ad9f1] rounded-xl text-[#1e1c1c] font-semibold">
                Total Score: {totalScore}
              </span>
            </div>

            {/* Submit button - show when user has made a guess but hasn't submitted yet */}
            {guess && !isGuessSubmitted && (
              <div className="flex justify-center mt-6">
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
                  className="px-8 py-4 rounded-xl bg-blue-500 text-white font-bold text-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Submit Guess
                </button>
              </div>
            )}

            {/* Results - show after submission */}
            {isGuessSubmitted && distance !== null && (
              <div className="text-center mt-6 space-y-2">
                <p className="text-lg text-white">
                  Distance:{" "}
                  <span className="font-semibold text-blue-400">
                    {distance} m
                  </span>
                </p>
                <p className="text-lg text-white">
                  Round Score:{" "}
                  <span className="font-semibold text-green-400">
                    {roundScore}
                  </span>
                </p>
              </div>
            )}

            {/* Next Round button - show after submission */}
            {isGuessSubmitted && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={nextRound}
                  className="px-8 py-4 rounded-xl bg-[#1c1c1c] border-3 border-[#15a6dd] text-white font-bold text-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  {round < totalRounds ? "Next Spot ➜" : "See Final Score"}
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