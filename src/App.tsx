/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { 
  Brain, Clock, ShieldAlert, Award, FileText, Lock, CheckCircle2, XCircle, 
  RefreshCw, Copy, Check, Sparkles, BookOpen, User, Mail, Calendar, ArrowRight,
  TrendingUp, Trophy, HelpCircle, ChevronRight, Lightbulb, Star, Download, Sparkle
} from "lucide-react";
import NeuralCanvas from "./components/NeuralCanvas";
import BrainCanvas from "./components/BrainCanvas";
import FloatingParticles from "./components/FloatingParticles";
import ThreeDTiltCard from "./components/ThreeDTiltCard";
import { questionBank, categories, categoryColors } from "./questions";
import { Question } from "./types";
import { generateCertificatePDF } from "./utils/certificate";
import { motion, AnimatePresence } from "motion/react";

// Standard Fisher-Yates shuffle
function fisherYates<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 30 questions (3 from each of the 10 categories, then shuffle)
function getSelectedQuestions(): Question[] {
  const shuffledBank = fisherYates(questionBank);
  const selected: Question[] = [];
  categories.forEach(cat => {
    const catQs = shuffledBank.filter(q => q.category === cat);
    selected.push(...catQs.slice(0, 3));
  });
  return fisherYates(selected);
}

// Timing definitions
const TOTAL_TEST_TIME = 1500; // 25 minutes in seconds

export default function App() {
  // Screen and User State
  const [currentScreen, setCurrentScreen] = useState<"landing" | "test" | "results" | "certificate">("landing");
  const [userName, setUserName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userDOB, setUserDOB] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);

  // Assessment flow states
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(TOTAL_TEST_TIME);
  const [secondsSpentOnCurrent, setSecondsSpentOnCurrent] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);

  // Interactive Question State
  const [chosenOption, setChosenOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  // Score Calculations
  const [iqScore, setIqScore] = useState(85);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [scoreRevealComplete, setScoreRevealComplete] = useState(false);

  // Certificate status
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Utility states
  const [copiedLink, setCopiedLink] = useState(false);
  const [typedText, setTypedText] = useState("");

  const typewriterFullText = "[ COGNITIVE ASSESSMENT PROTOCOL INITIATED ]";

  // Typewriter effect on Landing
  useEffect(() => {
    if (currentScreen !== "landing") return;
    let index = 0;
    const interval = setInterval(() => {
      if (index < typewriterFullText.length) {
        setTypedText(typewriterFullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [currentScreen]);

  // Global Timer and Question Timer
  useEffect(() => {
    if (!isTestActive) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          // Time expired
          setIsTestActive(false);
          handleFinishTest(answers, selectedQuestions, 0);
          return 0;
        }
        return prev - 1;
      });
      setSecondsSpentOnCurrent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestActive, answers, selectedQuestions]);

  // IQ Scoring logic
  const calculateIQ = (correct: number, totalTimeSeconds: number) => {
    // Standard psychometric normal distribution model (Mean = 100, SD = 15)
    // We assume the general population mean score on this test is 15/30 correct answers,
    // and the standard deviation of correct answers is 4.5.
    const z = (correct - 15) / 4.5;
    const baseIQ = 100 + z * 15;
    
    // Rigorously weighted speed bonus: capped at +5 points (max 0.33 SD)
    // Only awarded to proficient scores (15+ correct) to prevent rewarding rapid random guessing.
    let bonus = 0;
    if (correct >= 15) {
      if (totalTimeSeconds < 600) {
        bonus = 5; // Elite rapid processing
      } else if (totalTimeSeconds < 900) {
        bonus = 3; // Superior cognitive speed
      } else if (totalTimeSeconds < 1200) {
        bonus = 1; // High average efficiency
      }
    }

    const finalScore = Math.round(baseIQ + bonus);
    return {
      // Confine IQ scores within standard human biological limits (55 to 160)
      iq: Math.min(Math.max(finalScore, 55), 160),
      bonus
    };
  };

  // Get IQ Range Classification & Colors
  const getClassification = (score: number) => {
    if (score >= 160) return { title: "Genius", pct: "0.1", colorClass: "from-pink-500 to-rose-500 text-pink-400 bg-pink-500/10 border-pink-500/30" };
    if (score >= 145) return { title: "Highly Gifted", pct: "0.5", colorClass: "from-slate-300 to-zinc-400 text-zinc-300 bg-zinc-500/10 border-zinc-500/30" };
    if (score >= 130) return { title: "Gifted", pct: "2", colorClass: "from-amber-400 to-yellow-500 text-amber-400 bg-amber-500/10 border-amber-500/30" };
    if (score >= 115) return { title: "Superior", pct: "10", colorClass: "from-purple-500 to-indigo-500 text-purple-400 bg-purple-500/10 border-purple-500/30" };
    if (score >= 100) return { title: "Above Average", pct: "25", colorClass: "from-indigo-400 to-blue-500 text-indigo-400 bg-indigo-500/10 border-indigo-500/30" };
    return { title: "Average", pct: "40", colorClass: "from-blue-400 to-cyan-500 text-cyan-400 bg-blue-500/10 border-blue-500/30" };
  };

  // Start Assessment
  const handleStart = () => {
    if (userName.trim().length < 2) {
      setNameError(true);
      setTimeout(() => setNameError(false), 2000);
      return;
    }
    const qs = getSelectedQuestions();
    setSelectedQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setCorrectCount(0);
    setTimer(TOTAL_TEST_TIME);
    setSecondsSpentOnCurrent(0);
    setIsTestActive(true);
    setChosenOption(null);
    setShowTooltip(false);
    setCurrentScreen("test");
  };

  // Handle Option Selection
  const handleSelectOption = (option: "A" | "B" | "C" | "D") => {
    if (chosenOption !== null) return; // Prevent multiple selection

    const currentQ = selectedQuestions[currentIdx];
    const isCorrect = option === currentQ.correct;

    setChosenOption(option);
    setShowTooltip(true);

    if (!isCorrect) {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 400);
    }

    // Save Answer
    const updatedAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(updatedAnswers);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // Move forward after 1200ms delay to let the animation play
    setTimeout(() => {
      if (currentIdx < selectedQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setChosenOption(null);
        setShowTooltip(false);
        setSecondsSpentOnCurrent(0);
      } else {
        // Test completed
        setIsTestActive(false);
        const timeTaken = TOTAL_TEST_TIME - timer;
        handleFinishTest(updatedAnswers, selectedQuestions, timeTaken);
      }
    }, 1400);
  };

  // Handle Skip Button (marks wrong)
  const handleSkip = () => {
    if (chosenOption !== null) return;
    const currentQ = selectedQuestions[currentIdx];
    
    // Save as incorrect with null or blank selection
    const updatedAnswers = { ...answers, [currentQ.id]: "" as any };
    setAnswers(updatedAnswers);

    // Prompt show wrong screen flash or advance immediately
    setCurrentIdx(prev => {
      if (prev < selectedQuestions.length - 1) {
        setSecondsSpentOnCurrent(0);
        return prev + 1;
      } else {
        setIsTestActive(false);
        const timeTaken = TOTAL_TEST_TIME - timer;
        handleFinishTest(updatedAnswers, selectedQuestions, timeTaken);
        return prev;
      }
    });
  };

  // Finish assessment, compute scores and redirect to results
  const handleFinishTest = (
    finalAnswers: Record<number, "A" | "B" | "C" | "D">,
    questions: Question[],
    timeTakenSeconds: number
  ) => {
    // Count exact correct
    let correct = 0;
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.correct) {
        correct += 1;
      }
    });

    const scores = calculateIQ(correct, timeTakenSeconds);
    setIqScore(scores.iq);
    setSpeedBonus(scores.bonus);
    setCorrectCount(correct);
    setCurrentScreen("results");

    // Reset Count up animation
    setDisplayedScore(0);
    setScoreRevealComplete(false);
  };

  // Count up animation for Results Screen
  useEffect(() => {
    if (currentScreen !== "results") return;

    let start = 0;
    const duration = 2500; // 2.5 seconds
    const target = iqScore;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo formula
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(start + easeProgress * (target - start));

      setDisplayedScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayedScore(target);
        setScoreRevealComplete(true);
      }
    };

    requestAnimationFrame(animate);
  }, [currentScreen, iqScore]);

  // Category Scores computation
  const getCategoryScores = () => {
    const scores: Record<string, { correct: number; total: number; color: string }> = {};
    selectedQuestions.forEach(q => {
      if (!scores[q.category]) {
        scores[q.category] = { correct: 0, total: 0, color: q.categoryColor };
      }
      scores[q.category].total += 1;
      if (answers[q.id] === q.correct) {
        scores[q.category].correct += 1;
      }
    });
    return scores;
  };

  const catScores = getCategoryScores();

  // Highlight Best and Weakest category
  let bestCategory = "";
  let bestScore = -1;
  let worstCategory = "";
  let worstScore = 999;

  Object.entries(catScores).forEach(([cat, s]) => {
    const ratio = s.correct / s.total;
    if (ratio > bestScore) {
      bestScore = ratio;
      bestCategory = cat;
    }
    if (ratio < worstScore) {
      worstScore = ratio;
      worstCategory = cat;
    }
  });

  // Unique Certificate Id generator
  const getUniqueId = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `CIQ-${random}`;
  };

  const [certId] = useState(getUniqueId());

  // Handle Certificate PDF Download
  const handleDownload = () => {
    if (!userName || !userEmail || !consentChecked) return;

    setIsDownloading(true);

    const timeSpent = TOTAL_TEST_TIME - timer;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const classificationData = getClassification(iqScore);

    setTimeout(() => {
      try {
        generateCertificatePDF({
          name: userName,
          email: userEmail,
          iqScore: iqScore,
          correctCount: correctCount,
          timeTakenString: timeString,
          classification: classificationData.title,
          percentile: parseFloat(classificationData.pct),
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          certificateId: certId
        });
        setIsDownloading(false);
        setDownloadSuccess(true);
      } catch (err) {
        console.error(err);
        setIsDownloading(false);
        alert("Verification secure node is busy. Please try generating certificate again.");
      }
    }, 1800);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://neuraledge.io/credentials/${certId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTimer = (secondsLeft: number) => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return {
      minutesStr: mins.toString().padStart(2, "0"),
      secondsStr: secs.toString().padStart(2, "0")
    };
  };

  const { minutesStr, secondsStr } = formatTimer(timer);

  // Layout screen wrapper with framer-motion transition
  const screenVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
  };

  return (
    <div className="relative min-h-screen text-[#F1F5F9] font-sans overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background Neural Net */}
      <NeuralCanvas />

      {/* FIXED GLASS NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 glass border-b border-white/10 z-40 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-[#06B6D4] animate-pulse" />
          <span className="font-orbitron text-lg font-normal tracking-[4px] text-white">
            NEURAL<span className="font-bold border-b-2 border-cyan-500/60 pb-1">EDGE</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-block text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-widest font-semibold">
            ✦ MENSA STANDARD
          </span>
          <span className="text-xs font-rajdhani text-slate-400 font-medium uppercase tracking-[2px]">
            IQ Assessment v3.1
          </span>
        </div>
      </nav>

      {/* Top segments progress bar when in-test */}
      {currentScreen === "test" && (
        <div className="fixed top-16 left-0 right-0 h-[6px] bg-slate-900 z-50 flex">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 h-full transition-all duration-300 border-r border-[#020817]/60 ${
                i < currentIdx 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" 
                  : i === currentIdx 
                    ? "bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(6,182,212,1)]" 
                    : "bg-slate-950/90"
              }`}
            />
          ))}
        </div>
      )}

      {/* MAIN SCREEN INJECTOR CONTAINER */}
      <main className="relative pt-24 pb-12 px-4 z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          
          {/* ==================== SCREEN 1: LANDING ==================== */}
          {currentScreen === "landing" && (
            <motion.div 
              key="landing"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 mt-4"
            >
              {/* Left Column Content */}
              <div className="flex-1 space-y-6 text-left max-w-2xl">
                <div className="inline-block py-1 px-3 bg-cyan-950/50 border border-cyan-500/20 rounded text-[11px] font-mono text-cyan-400 tracking-wider">
                  <span className="typewriter-cursor pr-1 font-semibold">{typedText}</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-normal tracking-tight text-white leading-[1.15]">
                  Discover Your <br />
                  <span className="font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                    Cognitive Edge
                  </span>
                </h1>

                <p className="text-slate-400 font-sans text-base md:text-lg leading-relaxed">
                  30 elite-level questions across 10 core disciplines. Scientifically calibrated. 
                  MENSA-grade difficulty. Receive a certified IQ score and downloadable, shareable 
                  cryptographic credential instantly.
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <ThreeDTiltCard className="w-full">
                    <div className="glass p-3 md:p-4 rounded-xl border-t-2 border-t-[#06B6D4] hover:border-cyan-400 transition duration-300 h-full">
                      <BookOpen className="w-5 h-5 text-cyan-400 mb-2" />
                      <div className="font-orbitron text-xl md:text-2xl font-bold text-white">30</div>
                      <div className="font-rajdhani text-xs text-slate-400 tracking-widest font-semibold uppercase mt-1">Expert Questions</div>
                    </div>
                  </ThreeDTiltCard>
                  <ThreeDTiltCard className="w-full">
                    <div className="glass p-3 md:p-4 rounded-xl border-t-2 border-t-[#06B6D4] hover:border-cyan-400 transition duration-300 h-full">
                      <Brain className="w-5 h-5 text-violet-400 mb-2" />
                      <div className="font-orbitron text-xl md:text-2xl font-bold text-white">10</div>
                      <div className="font-rajdhani text-xs text-slate-400 tracking-widest font-semibold uppercase mt-1">Disciplines</div>
                    </div>
                  </ThreeDTiltCard>
                  <ThreeDTiltCard className="w-full">
                    <div className="glass p-3 md:p-4 rounded-xl border-t-2 border-t-[#06B6D4] hover:border-cyan-400 transition duration-300 h-full">
                      <Clock className="w-5 h-5 text-amber-400 mb-2" />
                      <div className="font-orbitron text-xl md:text-2xl font-bold text-white">~25</div>
                      <div className="font-rajdhani text-xs text-slate-400 tracking-widest font-semibold uppercase mt-1">Mins Average</div>
                    </div>
                  </ThreeDTiltCard>
                </div>

                {/* User Info Form */}
                <div className="space-y-3 pt-4">
                  <label className="block text-xs font-rajdhani text-cyan-400 uppercase tracking-[2px] font-bold">
                    ENTER YOUR FULL NAME FOR PORTAL INITIATION
                  </label>
                  <div className="relative max-w-md">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/60" />
                    <input 
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Alexandra Chen"
                      className={`w-full bg-[#0D1224]/90 text-white pl-12 pr-4 py-4 rounded-lg border ${
                        nameError 
                          ? "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-shake" 
                          : "border-cyan-500/20 focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(6,182,212,0.25)]"
                      } outline-none transition duration-300 font-sans text-base`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-red-400 text-xs font-sans mt-1 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" /> Please enter your name to authenticate core engine.
                    </p>
                  )}
                </div>

                {/* CTA Initiation Button */}
                <div className="pt-2">
                  <button 
                    onClick={handleStart}
                    disabled={userName.trim().length < 2}
                    className="shimmer-btn w-full max-w-md h-14 rounded-lg font-rajdhani text-lg font-bold uppercase tracking-widest text-white mt-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    BEGIN COGNITIVE ASSESSMENT →
                  </button>
                  <p className="text-slate-500 text-xs font-sans mt-3">
                    No signup required · Results computed instantly · Verifiable Certificate of Achievement
                  </p>
                </div>
              </div>

              {/* Right Column Visualization (Desktop Only) */}
              <div className="hidden lg:flex flex-1 items-center justify-center">
                <BrainCanvas />
              </div>

              {/* Scrolling Disciplines Marquee footer */}
              <footer className="w-full absolute bottom-[-40px] left-0 right-0 h-12 glass border-t border-white/5 flex items-center overflow-hidden whitespace-nowrap z-20">
                <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-xs font-rajdhani font-semibold tracking-widest uppercase text-[#94A3B8]">
                  {categories.concat(categories).concat(categories).map((cat, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-4 py-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                      <span className="text-slate-300">{cat}</span>
                    </div>
                  ))}
                </div>
              </footer>
            </motion.div>
          )}

          {/* ==================== SCREEN 2: TEST INTERFACE ==================== */}
          {currentScreen === "test" && selectedQuestions.length > 0 && (
            <motion.div 
              key="test"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-4xl flex flex-col gap-6 mt-4"
            >
              {/* STICKY HEADER */}
              <div className="flex items-center justify-between glass px-5 py-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <span className="font-rajdhani text-sm font-bold tracking-widest text-slate-300">
                    NEURALEDGE PORTAL
                  </span>
                </div>
                
                <div className="font-rajdhani text-base font-bold tracking-wider text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-4 py-1.5 rounded-full">
                  QUESTION <span className="font-mono text-white">{currentIdx + 1}</span> / 30
                </div>

                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-base font-semibold ${
                  timer < 120 ? "bg-red-950/40 border-red-500/40 text-red-400 animate-pulse" :
                  timer < 300 ? "bg-amber-950/40 border-amber-500/40 text-amber-400" :
                  "bg-slate-950/40 border-cyan-500/20 text-cyan-400"
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{minutesStr}</span>
                  <span className={timer % 2 === 0 ? "opacity-100" : "opacity-20"}>:</span>
                  <span>{secondsStr}</span>
                </div>
              </div>

              {/* MAIN QUESTION PANEL */}
              <ThreeDTiltCard className="w-full">
                <div className="relative glass rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl h-full w-full">
                  {/* Visual side accent lines */}
                  <div className="absolute top-0 left-0 w-12 h-[2px] bg-cyan-500" />
                  <div className="absolute top-0 left-0 w-[2px] h-12 bg-cyan-500" />

                {/* Question Info / Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full animate-ping" 
                      style={{ backgroundColor: selectedQuestions[currentIdx].categoryColor }} 
                    />
                    <span 
                      className="font-rajdhani text-sm font-bold tracking-widest uppercase"
                      style={{ color: selectedQuestions[currentIdx].categoryColor }}
                    >
                      {selectedQuestions[currentIdx].category}
                    </span>
                  </div>

                  {/* Difficulty stars */}
                  <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded border border-cyan-500/5">
                    <span className="text-[9px] font-mono font-semibold uppercase text-slate-500 tracking-wider">Difficulty:</span>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < selectedQuestions[currentIdx].difficulty 
                            ? "text-cyan-400 fill-cyan-400" 
                            : "text-slate-700"
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-4">
                  <span className="font-rajdhani text-xs uppercase font-semibold text-slate-500 tracking-widest block">
                    COGNITIVE QUERY PROMPT {selectedQuestions[currentIdx].id}
                  </span>
                  <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed font-sans">
                    {selectedQuestions[currentIdx].question}
                  </h2>
                </div>

                {/* ANSWER OPTION SELECTORS */}
                <div className="grid grid-cols-1 gap-3.5 pt-4">
                  {(Object.keys(selectedQuestions[currentIdx].options) as Array<"A" | "B" | "C" | "D">).map((opt) => {
                    const isSelected = chosenOption === opt;
                    const isCorrect = selectedQuestions[currentIdx].correct === opt;
                    const hasAnswered = chosenOption !== null;

                    // Option state styles using Sophisticated Dark variables
                    let cardStyle = "bg-[#0D1224]/40 border-white/5 hover:border-cyan-500/40 hover:bg-[#141B33]/40 hover:translate-x-1";
                    let circleStyle = "border-white/10 text-cyan-400 bg-[#020817]";

                    if (isSelected) {
                      if (isCorrect) {
                        cardStyle = "bg-emerald-950/60 border-emerald-500/50 shadow-[0_0_16px_rgba(16,185,129,0.3)] border-l-[3px] border-l-emerald-400";
                        circleStyle = "bg-emerald-500 text-slate-950 border-emerald-400";
                      } else {
                        cardStyle = "bg-red-950/60 border-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.3)] border-l-[3px] border-l-red-500";
                        circleStyle = "bg-red-500 text-white border-red-400";
                      }
                    } else if (hasAnswered && isCorrect) {
                      // Reveal correct option if user answered incorrectly
                      cardStyle = "bg-emerald-950/30 border-emerald-500/30 border-l-[3px] border-l-emerald-500/60";
                      circleStyle = "border-emerald-500/50 text-emerald-400 bg-emerald-950/20";
                    } else if (hasAnswered) {
                      // Muted styles for unselected wrong answers
                      cardStyle = "bg-slate-950/20 border-slate-900/60 opacity-40 cursor-not-allowed";
                      circleStyle = "border-slate-800 text-slate-600 bg-slate-950";
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(opt)}
                        disabled={hasAnswered}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left outline-none cursor-pointer ${cardStyle}`}
                      >
                        <span className={`w-10 h-10 flex items-center justify-center rounded-full border text-base font-bold transition-all duration-300 font-rajdhani ${circleStyle}`}>
                          {opt}
                        </span>
                        <span className="flex-1 text-slate-200 text-sm md:text-base font-sans">
                          {selectedQuestions[currentIdx].options[opt]}
                        </span>

                        {/* Status Checkmark icons */}
                        {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-2 animate-shake" />}
                      </button>
                    );
                  })}
                </div>

                {/* EXPLANATION TOOLTIP REVEAL */}
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-cyan-950/30 border border-cyan-500/10 rounded-xl flex items-start gap-3"
                    >
                      <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-rajdhani uppercase font-bold tracking-widest text-cyan-400 mb-1">
                          Cognitive Explanation
                        </div>
                        <p className="text-slate-300 text-xs md:text-sm font-sans leading-relaxed">
                          {selectedQuestions[currentIdx].explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ThreeDTiltCard>

              {/* BOTTOM CONTROL STATUS BAR */}
              <div className="flex items-center justify-center text-slate-400 px-2 text-xs md:text-sm">
                <div className="flex items-center gap-1.5 font-sans font-medium text-slate-400">
                  <Sparkle className="w-4 h-4 text-cyan-400" />
                  <span>{30 - currentIdx} cognitive prompts remaining</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 3: RESULTS ==================== */}
          {currentScreen === "results" && (
            <motion.div 
              key="results"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-4xl flex flex-col items-center gap-8 mt-4"
            >
              {/* ASSESSMENT COMPLETED INTRO */}
              <div className="text-center space-y-2">
                <div className="inline-block px-3 py-1 rounded bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                  Cognitive Scan Finalized
                </div>
                <h1 className="text-3xl md:text-4xl font-orbitron font-bold uppercase tracking-widest text-white mt-1">
                  Assessment Complete
                </h1>
                <div className="w-24 h-[1px] bg-cyan-500/30 mx-auto" />
              </div>

              {/* IQ SCORE DISPLAY (HERO MOMENT) */}
              <ThreeDTiltCard className="w-full max-w-md">
                <div className="relative glass border border-amber-500/15 rounded-2xl p-8 text-center space-y-4 shadow-[0_0_32px_rgba(245,158,11,0.15)] h-full w-full">
                  {scoreRevealComplete && <FloatingParticles />}

                <span className="font-rajdhani text-xs uppercase text-slate-500 font-bold tracking-[3px]">
                  YOUR CERTIFIED COGNITIVE PROFILE
                </span>

                <div className="space-y-1 relative z-20">
                  <div className="text-7xl md:text-8xl font-orbitron font-extrabold bg-gradient-to-b from-[#FCD34D] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] text-glow-gold">
                    {displayedScore}
                  </div>
                  <div className="text-xs font-mono text-cyan-400 tracking-widest font-bold uppercase">
                    INTELLIGENCE QUOTIENT (IQ)
                  </div>
                </div>

                {/* Classification Badge Spring Reveal */}
                <div className="pt-2 flex justify-center">
                  <AnimatePresence>
                    {scoreRevealComplete && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } }}
                        className={`px-5 py-2 rounded bg-gradient-to-r text-slate-950 font-rajdhani font-black text-sm uppercase tracking-[2px] shadow-lg ${getClassification(iqScore).colorClass}`}
                      >
                        ✦ {getClassification(iqScore).title} ✦
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-slate-400 text-xs font-sans max-w-xs mx-auto">
                  You scored higher than <span className="text-amber-400 font-bold font-mono">{100 - parseFloat(getClassification(iqScore).pct)}%</span> of standard test takers globally (Top {getClassification(iqScore).pct}%).
                </p>
              </div>
            </ThreeDTiltCard>

              {/* QUICK SCORE BREAKDOWN GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="glass p-4 rounded-xl text-center space-y-1">
                  <div className="text-xs font-rajdhani font-semibold text-slate-400 uppercase tracking-wider">Correct Answers</div>
                  <div className="text-xl font-mono font-bold text-emerald-400">{correctCount} / 30</div>
                </div>
                <div className="glass p-4 rounded-xl text-center space-y-1">
                  <div className="text-xs font-rajdhani font-semibold text-slate-400 uppercase tracking-wider">Wrong Answers</div>
                  <div className="text-xl font-mono font-bold text-red-400">{30 - correctCount} / 30</div>
                </div>
                <div className="glass p-4 rounded-xl text-center space-y-1">
                  <div className="text-xs font-rajdhani font-semibold text-slate-400 uppercase tracking-wider">Time Duration</div>
                  <div className="text-xl font-mono font-bold text-blue-400">
                    {Math.floor((TOTAL_TEST_TIME - timer) / 60)}:{(TOTAL_TEST_TIME - timer) % 60 < 10 ? "0" : ""}{(TOTAL_TEST_TIME - timer) % 60}
                  </div>
                </div>
                <div className="glass p-4 rounded-xl text-center space-y-1">
                  <div className="text-xs font-rajdhani font-semibold text-slate-400 uppercase tracking-wider">Speed Bonus</div>
                  <div className="text-xl font-mono font-bold text-amber-400">{speedBonus > 0 ? `+${speedBonus} PTS` : "—"}</div>
                </div>
              </div>

              {/* PERFORMANCE BY DISCIPLINE */}
              <div className="glass rounded-2xl p-6 w-full space-y-5">
                <h2 className="font-rajdhani text-lg font-bold uppercase tracking-[2px] text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" /> COGNITIVE DISCIPLINE ANALYSIS
                </h2>
                <div className="w-full h-[1px] bg-slate-800" />

                <div className="space-y-4">
                  {Object.entries(catScores).map(([cat, stat], idx) => {
                    const pct = (stat.correct / stat.total) * 100;
                    const isBest = cat === bestCategory;
                    const isWorst = cat === worstCategory && pct < 100;

                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                            <span className="font-rajdhani font-semibold text-slate-200 uppercase tracking-wider">{cat}</span>
                            {isBest && <Star className="w-4 h-4 text-amber-400 fill-amber-400" title="Strongest Category" />}
                            {isWorst && <span className="text-[10px] font-mono font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-950/20 border border-red-500/20 uppercase">Room to grow</span>}
                          </div>
                          <div className="font-mono text-xs text-slate-300">
                            {stat.correct} / {stat.total} Correct <span className="text-slate-500">({Math.round(pct)}%)</span>
                          </div>
                        </div>

                        {/* Staggered progress bar animations */}
                        <div className="h-2 bg-slate-950/70 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={scoreRevealComplete ? { width: `${pct}%` } : { width: 0 }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ 
                              backgroundImage: `linear-gradient(to right, ${stat.color}88, ${stat.color})`,
                              boxShadow: `0 0 6px ${stat.color}44`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* IQ RANGE CLASSIFICATION SCALE VISUALIZER */}
              <div className="glass rounded-2xl p-6 w-full space-y-6">
                <h3 className="font-rajdhani text-sm font-bold uppercase text-slate-400 tracking-[2px] text-center">
                  GLOBAL COGNITIVE SPECTRUM DISTRIBUTION
                </h3>

                {/* Relative position marker track */}
                <div className="relative pt-8 pb-3">
                  {/* Glowing user pin pointing down */}
                  <motion.div 
                    initial={{ left: 0, opacity: 0 }}
                    animate={scoreRevealComplete ? { left: `${((Math.max(85, Math.min(160, iqScore)) - 85) / 75) * 100}%`, opacity: 1 } : { left: 0, opacity: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-20"
                  >
                    <div className="bg-amber-400 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                      {iqScore}
                    </div>
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-amber-400" />
                  </motion.div>

                  {/* Gradient Spectrum line */}
                  <div className="h-2.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 via-amber-500 via-zinc-400 to-pink-500 rounded-full" />

                  {/* Scale Axis ticks */}
                  <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-2">
                    <span>85</span>
                    <span>100</span>
                    <span>115</span>
                    <span>130</span>
                    <span>145</span>
                    <span>160+</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-[11px] font-rajdhani uppercase tracking-wider">
                  <div className="p-2 border border-blue-500/10 rounded bg-blue-500/5 text-blue-400">85-99 Avg</div>
                  <div className="p-2 border border-indigo-500/10 rounded bg-indigo-500/5 text-indigo-400">100-114 Above Avg</div>
                  <div className="p-2 border border-purple-500/10 rounded bg-purple-500/5 text-purple-400">115-129 Superior</div>
                  <div className="p-2 border border-amber-500/10 rounded bg-amber-500/5 text-amber-400">130-144 Gifted</div>
                  <div className="p-2 border border-zinc-500/10 rounded bg-zinc-500/5 text-zinc-400">145-159 Highly Gifted</div>
                  <div className="p-2 border border-pink-500/10 rounded bg-pink-500/5 text-pink-400">160+ Genius</div>
                </div>
              </div>

              {/* ACTION CALL-TO-ACTIONS */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <button 
                  onClick={() => setCurrentScreen("certificate")}
                  className="shimmer-btn flex-1 h-14 text-slate-950 font-rajdhani font-bold text-base uppercase tracking-widest rounded transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)", boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" }}
                >
                  <Award className="w-5 h-5 shrink-0 text-slate-950" /> CLAIM YOUR CERTIFICATE →
                </button>

                <button 
                  onClick={() => {
                    setSelectedQuestions([]);
                    setAnswers({});
                    setTimer(TOTAL_TEST_TIME);
                    setCurrentIdx(0);
                    setCurrentScreen("landing");
                  }}
                  className="px-6 h-14 bg-[#0D1224]/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:bg-cyan-500/5 font-rajdhani font-bold text-sm uppercase tracking-widest rounded transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 shrink-0" /> Retake Assessment
                </button>

                <button 
                  onClick={handleShare}
                  className="px-6 h-14 bg-[#0D1224]/80 border border-slate-700 hover:border-slate-500 text-slate-300 font-rajdhani font-bold text-sm uppercase tracking-widest rounded transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                  {copiedLink ? "Link Copied!" : "Share Link"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 4: CERTIFICATE CLAIM ==================== */}
          {currentScreen === "certificate" && (
            <motion.div 
              key="certificate"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 mt-4"
            >
              {/* Left Panel: Validation Form */}
              <div className="flex-1 space-y-6 text-left max-w-xl">
                <div className="space-y-2">
                  <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-wider">
                    Your Certificate Awaits
                  </h1>
                  <p className="text-slate-400 text-sm font-sans leading-relaxed">
                    Personalize your elite credentials. This official document secures your place in the global 
                    cognitive database and is available for print or digital export.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-slate-800" />

                {/* Form fields */}
                <div className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold">
                      Certificate Holder Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Holder name"
                        className="w-full bg-[#0D1224] text-white pl-12 pr-4 py-3.5 rounded-lg border border-cyan-500/10 focus:border-cyan-400 outline-none transition font-sans text-sm"
                      />
                    </div>
                  </div>

                  {/* Email Field with validation */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold">
                      Secure Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="holder@gmail.com"
                        className="w-full bg-[#0D1224] text-white pl-12 pr-4 py-3.5 rounded-lg border border-cyan-500/10 focus:border-cyan-400 outline-none transition font-sans text-sm"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Used strictly to authenticate and secure your credential. We never share your data.
                    </span>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold">
                      Date of Birth (Optional for validation)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="text"
                        value={userDOB}
                        onChange={(e) => setUserDOB(e.target.value)}
                        placeholder="e.g. October 15, 1998"
                        className="w-full bg-[#0D1224] text-white pl-12 pr-4 py-3.5 rounded-lg border border-cyan-500/10 focus:border-cyan-400 outline-none transition font-sans text-sm"
                      />
                    </div>
                  </div>

                  {/* Consent checkbox */}
                  <label className="flex items-start gap-3 pt-2 text-xs text-slate-400 font-sans cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 rounded text-cyan-500 border-cyan-500/20 bg-slate-900 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer"
                    />
                    <span className="leading-relaxed">
                      I confirm that this assessment was completed strictly by me personally without artificial aids 
                      and I agree to the NeuralEdge standard Terms of Assessment validation.
                    </span>
                  </label>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleDownload}
                    disabled={!userName.trim() || !userEmail.includes("@") || !consentChecked || isDownloading}
                    className="shimmer-btn w-full h-14 rounded-lg font-rajdhani text-slate-950 font-black text-sm uppercase tracking-[3px] shadow-[0_4px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_0_24px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: "linear-gradient(90deg, #F59E0B, #EA580C)" }}
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-slate-950" /> GENERATING SECURE PDF...
                      </>
                    ) : downloadSuccess ? (
                      <>
                        <Check className="w-5 h-5 text-slate-950" /> CREDENTIAL GENERATED!
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 text-slate-950" /> DOWNLOAD CERTIFICATE (PDF)
                      </>
                    )}
                  </button>

                  <div className="flex justify-between text-slate-500 text-[11px] font-mono mt-4">
                    <span>🔒 SSL SECURED</span>
                    <span>📄 PORTABLE PDF FORMAT</span>
                    <span>✦ INSTANT DIGITAL DEPLOY</span>
                  </div>
                </div>

                {downloadSuccess && (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Your certificate has been securely generated and downloaded. Share your success or upload your credential 
                      to LinkedIn!
                    </p>
                  </div>
                )}
              </div>

              {/* Right Panel: Live Certificate Preview (Desktop only) */}
              <div className="hidden lg:flex flex-1 flex-col items-center justify-center space-y-4">
                <span className="font-rajdhani text-xs uppercase text-slate-500 font-bold tracking-[3px]">
                  LIVE CREDENTIAL PREVIEW
                </span>

                {/* Simulated Certificate Preview Box */}
                <ThreeDTiltCard className="w-[480px]">
                  <div className="relative w-full h-[340px] bg-[#020817] border-2 border-amber-500/30 rounded-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                    {/* Subtle golden shimmer border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full animate-shimmer" />

                  {/* Corner ornaments visual */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-500/50" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-500/50" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-amber-500/50" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-500/50" />

                  {/* Preview watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 rotate-[-15deg]">
                    <span className="text-slate-800/10 font-orbitron text-4xl font-extrabold tracking-widest uppercase">
                      Live Preview watermark
                    </span>
                  </div>

                  {/* Certificate header */}
                  <div className="text-center space-y-1 relative z-20">
                    <div className="font-orbitron text-xs text-amber-500 tracking-[3px] font-bold">
                      NEURAL / EDGE
                    </div>
                    <div className="w-16 h-[0.5px] bg-amber-500/30 mx-auto" />
                    <div className="font-rajdhani text-[9px] text-cyan-400 uppercase tracking-widest font-black">
                      Certificate of Cognitive Achievement
                    </div>
                  </div>

                  {/* Recipient body */}
                  <div className="text-center space-y-2 relative z-20">
                    <span className="text-[10px] text-slate-500 font-sans italic block">This is to certify that</span>
                    <span className="text-lg font-orbitron font-bold text-white tracking-wide block truncate">
                      {userName.toUpperCase() || "YOUR NAME HERE"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans block max-w-xs mx-auto">
                      has demonstrated exceptional cognitive performance, achieving a certified score of:
                    </span>
                    <span className="text-3xl font-orbitron font-extrabold text-[#F59E0B] drop-shadow-md block">
                      {iqScore}
                    </span>
                  </div>

                  {/* Badge & Footer details */}
                  <div className="flex items-center justify-between text-[9px] relative z-20 border-t border-slate-900 pt-3">
                    <div className="text-left space-y-0.5">
                      <span className="text-slate-500 block">IQ RANGE</span>
                      <span className="text-cyan-400 font-bold uppercase">{getClassification(iqScore).title}</span>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center font-bold text-amber-500 text-[6px]">
                      SEAL
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-slate-500 block">VERIFIED ID</span>
                      <span className="text-amber-500 font-mono font-bold">{certId}</span>
                    </div>
                  </div>
                </div>
              </ThreeDTiltCard>

                <p className="text-slate-500 text-[11px] font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive preview updates dynamically
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
