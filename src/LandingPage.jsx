import logo from "./assets/logo_ACM_Footer.png";
import bgImage from "./assets/THAPAR IMAGE.jpg";

export default function LandingPage({ onStartGame, highScore }) {
  return (
    <div className="relative min-h-screen w-full bg-retro-pixel-gradient text-slate-100 px-4 sm:px-8 py-6 sm:py-10 flex flex-col items-center justify-between font-['Space_Grotesk'] overflow-x-hidden">
      {/* Background Image Layer with Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={bgImage}
          alt="Thapar Campus Background"
          className="w-full h-full object-cover object-center scale-105 opacity-85 blur-[2px] transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b16]/90 via-[#070b16]/75 to-[#070b16]/95 pointer-events-none"></div>
      </div>

      {/* Top Header Navigation & Chapter Badge */}
      <header className="relative z-10 w-full max-w-5xl flex flex-wrap justify-between items-center gap-4 bg-[#0b1021]/70 backdrop-blur-md border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-black/80 border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_#000]">
            <img
              src={logo}
              alt="ACM Thapar Logo"
              className="h-7 sm:h-9 w-auto object-contain [image-rendering:pixelated]"
            />
          </div>
          <div>
            <span className="font-['Silkscreen'] text-[10px] sm:text-xs text-[#38bdf8] tracking-wider block">
              ACM THAPAR STUDENT CHAPTER
            </span>
            <span className="font-['Press_Start_2P'] text-[9px] sm:text-[11px] text-[#fbbf24]">
              PRESENTS
            </span>
          </div>
        </div>

        {/* Live status pill & High score badge */}
        <div className="flex items-center gap-3">
          {highScore !== null && highScore !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 border-2 border-black rounded-xl font-['Silkscreen'] text-xs text-[#fbbf24] shadow-[2px_2px_0px_0px_#000]">
              <span>BEST:</span>
              <span>{highScore} / 9</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10172a] border-2 border-black rounded-xl font-['Silkscreen'] text-xs text-[#34d399] shadow-[2px_2px_0px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-ping"></span>
            <span>EDITION 2026</span>
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center my-auto py-8 gap-8 animate-spot-fade">
        {/* Main Game Title Block */}
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#38bdf8]/10 border-2 border-[#38bdf8]/40 rounded-full mb-2">
            <span className="font-['Silkscreen'] text-xs text-[#38bdf8] tracking-widest uppercase">
              🧭 THAPAR CAMPUS GEO-GUESSER
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-['Press_Start_2P'] leading-tight tracking-tight drop-shadow-[5px_5px_0px_#000]">
            <span className="text-[#fbbf24]">CAMPUS</span>{" "}
            <span className="text-[#38bdf8]">CLUE</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed drop-shadow-sm px-2">
            Think you know every spot of Thapar University? Test your visual memory, spot hidden landmarks, and pinpoint exact map coordinates!
          </p>
        </div>

        {/* Big CTA Start Button Section */}
        <div className="flex flex-col items-center gap-3 my-2">
          <button
            onClick={onStartGame}
            className="group relative px-10 sm:px-14 py-5 sm:py-6 bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] hover:from-[#f59e0b] hover:to-[#d97706] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_#000] text-black font-['Press_Start_2P'] text-base sm:text-xl border-4 sm:border-6 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl cursor-pointer transition-all duration-150 uppercase tracking-wider flex items-center gap-3.5 hover:scale-105"
          >
            <span>START GAME</span>
          </button>

          <span className="font-['Silkscreen'] text-xs text-slate-400 tracking-wider">
            9 ROUNDS • 10-SEC PREVIEW • MAP GUESSING
          </span>
        </div>

        {/* Game Mode / Highlights Quick Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {/* Card 1 */}
          <div className="bg-[#0b1021]/80 backdrop-blur-md border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center text-center gap-2 hover:border-[#38bdf8] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/20 border-2 border-black flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👁️
            </div>
            <h3 className="font-['Silkscreen'] text-sm text-[#38bdf8]">1. VIEW SPOT</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Memorize the mystery photo shown for 10 seconds before it disappears.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0b1021]/80 backdrop-blur-md border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center text-center gap-2 hover:border-[#fbbf24] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/20 border-2 border-black flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📍
            </div>
            <h3 className="font-['Silkscreen'] text-sm text-[#fbbf24]">2. PIN MAP</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click on the interactive Thapar campus map to drop your guess marker.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0b1021]/80 backdrop-blur-md border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex flex-col items-center text-center gap-2 hover:border-[#34d399] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#34d399]/20 border-2 border-black flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏆
            </div>
            <h3 className="font-['Silkscreen'] text-sm text-[#34d399]">3. WIN POINTS</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Guess within 50 meters distance to score points and unlock top ranks!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl text-center font-['Silkscreen'] text-[10px] sm:text-xs text-slate-400 border-t-2 border-slate-800/80 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>CAMPUS CLUE © 2026 • ACM THAPAR</span>
        <span className="text-slate-500">CRAFTED FOR THAPARIANS & GEO-GUESSER FANS</span>
      </footer>
    </div>
  );
}
