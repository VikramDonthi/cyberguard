import React, { useState, useEffect } from 'react';
import { Page, CyberCrime, QuizQuestion } from './types';
import { CYBER_CRIMES, QUIZ_QUESTIONS } from './constants';
import { SecurityDiagnostic } from './components/SecurityDiagnostic';

// Static pool of security insights to replace AI-generated content
const STATIC_INSIGHTS = [
  "Always verify any information you receive online by using the **5W’s** (Who, Why, Where, When, and What) to ensure it is authentic and not fake news.",
  "If you encounter inappropriate or disturbing content, remember to **Turn, Run and Tell** a trusted adult immediately.",
  "Dial **1930** immediately if you are a victim of financial fraud. Reporting within the first two hours (Golden Hour) is critical.",
  "Official reporting for all cyber crimes should be done at the government portal: **www.cybercrime.gov.in**.",
  "Enable **Multi-Factor Authentication** (MFA) on every social media and banking account to provide a secondary layer of defense.",
  "Banks will **never** ask for your OTP, PIN, or CVV over a phone call or email. Never share these credentials with anyone.",
  "Avoid using **public USB charging ports** (Juice Jacking) as they can be used to silently install data-stealing malware on your device.",
  "Keep your **webcam covered** with a physical slider when not in use to prevent unauthorized remote visual surveillance.",
  "Use a **passphrase** (a long sentence) instead of a simple password. Length is more important than complexity for thwarting modern bots.",
  "Check for the **Lock Icon** and 'HTTPS' in the address bar before entering sensitive data on any website.",
  "Perform a **Reverse Image Search** on viral photos before forwarding them to verify their original source and context.",
  "Set a **SIM Card PIN** to prevent attackers from using your phone number for identity theft if your device is stolen."
];

interface QuizState {
  active: boolean;
  questions: QuizQuestion[];
  currentIdx: number;
  score: number;
  finished: boolean;
  selectedOption: number | null;
  showFeedback: boolean;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCrime, setSelectedCrime] = useState<CyberCrime | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);
  const [isUpdatingInsight, setIsUpdatingInsight] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('cyberguard-theme');
    return saved ? saved === 'dark' : true;
  });

  const [quizState, setQuizState] = useState<QuizState>({
    active: false,
    questions: [],
    currentIdx: 0,
    score: 0,
    finished: false,
    selectedOption: null,
    showFeedback: false
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Pick a random initial tip
    setInsightIndex(Math.floor(Math.random() * STATIC_INSIGHTS.length));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const rotateInsight = () => {
    setIsUpdatingInsight(true);
    // Brief animation for tactile feedback
    setTimeout(() => {
      setInsightIndex((prev) => (prev + 1) % STATIC_INSIGHTS.length);
      setIsUpdatingInsight(false);
    }, 300);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('cyberguard-theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('cyberguard-theme', 'light');
    }
  }, [isDarkMode]);

  const isSecure = window.location.protocol === 'https:';

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedCrime(null);
    setQuizState({ ...quizState, active: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to render bold text from markdown-like ** syntax
  const formatAdviceText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-emerald-500 dark:text-emerald-400">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const NavItem = ({ page, icon, label, mobile = false }: { page: Page, icon: string, label: string, mobile?: boolean }) => (
    <button 
      onClick={() => navigate(page)}
      className={`flex items-center transition-all duration-300 ${
        mobile 
          ? `flex-col gap-0.5 flex-1 py-1.5 ${currentPage === page ? 'text-emerald-500' : 'text-slate-500'}`
          : `gap-3 px-5 py-3 rounded-xl w-full text-left border ${
              currentPage === page 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-sm' 
                : 'border-transparent text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)]'
            }`
      }`}
    >
      <i className={`fas ${icon} ${mobile ? 'text-sm' : 'w-5 text-sm'}`}></i>
      <span className={mobile ? "text-[8px] font-bold tracking-tight" : "font-semibold text-xs"}>{label}</span>
    </button>
  );

  const ThemeToggle = ({ mobile = false }: { mobile?: boolean }) => (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`flex items-center gap-3 transition-all ${
        mobile 
          ? 'w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border)] items-center justify-center' 
          : 'w-full px-5 py-3 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
      }`}
    >
      <i className={`fas ${isDarkMode ? 'fa-sun text-amber-500' : 'fa-moon text-indigo-500'} ${mobile ? 'text-[10px]' : 'w-5'}`}></i>
      {!mobile && <span className="font-semibold text-xs">{isDarkMode ? 'Day Mode' : 'Night Mode'}</span>}
    </button>
  );

  const startQuiz = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    const randomizedQuestions = selected.map(q => {
      const optionsWithStatus = q.options.map((opt, idx) => ({ 
        text: opt, 
        isCorrect: idx === q.answer 
      }));
      const shuffledOptions = [...optionsWithStatus].sort(() => Math.random() - 0.5);
      const newAnswerIndex = shuffledOptions.findIndex(o => o.isCorrect);
      return {
        ...q,
        options: shuffledOptions.map(o => o.text),
        answer: newAnswerIndex
      };
    });

    setQuizState({
      active: true,
      questions: randomizedQuestions,
      currentIdx: 0,
      score: 0,
      finished: false,
      selectedOption: null,
      showFeedback: false
    });
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizState.showFeedback) return;
    const isCorrect = optionIdx === quizState.questions[quizState.currentIdx].answer;
    setQuizState(prev => ({
      ...prev,
      selectedOption: optionIdx,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentIdx + 1 < quizState.questions.length) {
      setQuizState(prev => ({
        ...prev,
        currentIdx: prev.currentIdx + 1,
        selectedOption: null,
        showFeedback: false
      }));
    } else {
      setQuizState(prev => ({ ...prev, finished: true }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent transition-colors duration-300">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 soft-glass h-screen p-6 flex-col gap-6 sticky top-0 border-r border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 guardian-gradient rounded-lg flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-shield-halved text-sm"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[var(--text-main)] leading-none">CyberGuard</h1>
            <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest mt-1 opacity-80">Security Portal</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-0.5">
          <NavItem page="home" icon="fa-grip" label="Dashboard" />
          <NavItem page="crimes" icon="fa-fingerprint" label="Crime Library" />
          <NavItem page="safety" icon="fa-shield-halved" label="Security Rules" />
          <NavItem page="quiz" icon="fa-brain" label="Knowledge Lab" />
          <NavItem page="report" icon="fa-file-signature" label="Reporting Center" />
        </nav>

        <div className="mt-auto space-y-2">
          <ThemeToggle />
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-slate-900/50 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">System Health</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
            </div>
            <button 
              onClick={() => setIsDiagnosticOpen(true)}
              className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-emerald-500/20 transition-all active:scale-95"
            >
              Run Diagnostic
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-3 py-2 soft-glass sticky top-0 z-40 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 guardian-gradient rounded-lg flex items-center justify-center text-white text-[10px]">
            <i className="fas fa-shield-halved"></i>
          </div>
          <h1 className="text-sm font-bold text-[var(--text-main)] tracking-tight">CyberGuard</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle mobile />
          <button 
            onClick={() => setIsDiagnosticOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--border)] active:bg-black/10 transition-colors"
          >
            <i className={`fas ${!isOnline ? 'fa-wifi-slash text-red-500' : isSecure ? 'fa-lock text-emerald-500' : 'fa-lock-open text-amber-500'} text-[9px]`}></i>
            <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Audit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-3 md:p-10 pb-20 md:pb-10 max-w-6xl mx-auto w-full overflow-x-hidden">
        {currentPage === 'home' && (
          <div className="space-y-8 md:space-y-12 animate-slide-up">
            <section className="space-y-4 md:space-y-6 text-center md:text-left pt-4 md:pt-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] md:text-[9px] font-bold tracking-widest uppercase">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                Security Resource
              </div>
              <h2 className="text-3xl md:text-7xl font-bold leading-[0.9] tracking-tight text-[var(--text-main)]">
                Protect your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 filter drop-shadow-sm">Digital Identity.</span>
              </h2>
              <p className="text-[12px] md:text-lg text-[var(--text-muted)] max-w-xl mx-auto md:mx-0 font-medium leading-relaxed">
                Millions on firewalls and encryption mean nothing if humans are the weakest link. Stay ahead of cybercrime with practical defense strategies and real-time environment auditing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                <button 
                  onClick={() => navigate('crimes')} 
                  className="px-8 md:px-12 py-3.5 md:py-4 guardian-gradient rounded-xl font-bold text-white text-[10px] md:text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                >
                  Explore Library
                </button>
                <button 
                  onClick={() => navigate('report')} 
                  className="px-8 md:px-12 py-3.5 md:py-4 bg-slate-200 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl font-bold text-slate-900 dark:text-white text-[10px] md:text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group shadow-sm hover:shadow-md"
                >
                  <i className="fas fa-file-signature text-emerald-500 text-xs group-hover:rotate-12 transition-transform"></i>
                  Report Threat
                </button>
              </div>
            </section>

            {/* CyberGuard Insights Section (Static) */}
            <section className="relative p-6 md:p-10 bg-[var(--surface)] rounded-[1.5rem] md:rounded-[2.5rem] border border-[var(--border)] overflow-hidden shadow-[var(--card-shadow)] flex flex-col lg:flex-row gap-8 items-center group">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
               
               <div className="w-full lg:w-1/2 space-y-6 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <i className="fas fa-shield-halved text-xs"></i>
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">CyberGuard <span className="text-emerald-500">Insights</span></h3>
                  </div>

                  <div className={`bg-black/10 dark:bg-white/[0.03] p-5 rounded-2xl border border-[var(--border)] min-h-[140px] flex flex-col justify-center transition-all duration-300 ${isUpdatingInsight ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} group-hover:border-emerald-500/20`}>
                    <p className="text-[13px] md:text-base text-[var(--text-main)] leading-relaxed italic opacity-90">
                      "{formatAdviceText(STATIC_INSIGHTS[insightIndex])}"
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={rotateInsight}
                      className="px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95"
                    >
                      New Insight
                    </button>
                    <button 
                      onClick={() => navigate('safety')}
                      className="px-5 py-2.5 bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 text-[var(--text-muted)] border border-[var(--border)] rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95"
                    >
                      View All Rules
                    </button>
                  </div>
               </div>

               <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-black/5 dark:bg-white/[0.02] p-5 rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center text-center">
                    <div className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Network Layer</div>
                    <div className={`text-xs font-bold uppercase ${isOnline ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isOnline ? 'Connected' : 'Offline'}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                  </div>

                  <div className="bg-black/5 dark:bg-white/[0.02] p-5 rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center text-center">
                    <div className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Protocol Security</div>
                    <div className={`text-xs font-bold uppercase ${isSecure ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {isSecure ? 'Secure' : 'Warning'}
                    </div>
                    <i className={`fas ${isSecure ? 'fa-lock' : 'fa-unlock'} mt-2 text-[10px] ${isSecure ? 'text-emerald-500' : 'text-amber-500'}`}></i>
                  </div>

                  <div className="bg-black/5 dark:bg-white/[0.02] p-5 rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center text-center">
                    <div className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Platform Intel</div>
                    <div className="text-xs font-bold text-indigo-500 truncate w-full">
                      {navigator.platform || 'Unknown'}
                    </div>
                    <div className="text-[8px] mt-1 text-[var(--text-muted)] opacity-50 uppercase">{navigator.hardwareConcurrency} Cores Detectable</div>
                  </div>

                  <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                    <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5">System Audit</div>
                    <button 
                      onClick={() => setIsDiagnosticOpen(true)}
                      className="text-[10px] font-black text-emerald-500 uppercase hover:underline"
                    >
                      Full Diagnostic
                    </button>
                    <i className="fas fa-arrow-right mt-2 text-[10px] text-emerald-500"></i>
                  </div>
               </div>
            </section>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: 'Hotline', count: '1930', icon: 'fa-phone', link: 'tel:1930' },
                { label: 'Portal', count: 'Report', icon: 'fa-landmark', link: 'https://www.cybercrime.gov.in' },
                { label: 'Child Safety', count: '1098', icon: 'fa-heart', link: 'tel:1098' },
                { label: 'Verify', count: 'Fact Check', icon: 'fa-check', link: 'https://factcheck.telangana.gov.in' },
              ].map((stat, i) => (
                <a key={i} href={stat.link} className="bg-[var(--surface)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[var(--border)] flex flex-col items-center text-center transition-all hover:bg-[var(--surface-hover)] active:scale-95 shadow-sm">
                  <i className={`fas ${stat.icon} text-[var(--text-muted)] mb-2 text-sm md:text-lg`}></i>
                  <div className="text-sm md:text-lg font-bold text-[var(--text-main)] tracking-tight">{stat.count}</div>
                  <div className="text-[7px] md:text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest mt-0.5">{stat.label}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'crimes' && (
          <div className="space-y-6 md:space-y-10 animate-slide-up">
            <div className="border-l-3 border-emerald-500 pl-3 md:pl-5">
              <h2 className="text-xl md:text-4xl font-extrabold text-[var(--text-main)] uppercase tracking-tight">Intelligence Library</h2>
              <p className="text-[var(--text-muted)] font-medium mt-1 text-[10px] md:text-base">Deep-dive into modern digital threat vectors.</p>
            </div>
            
            {!selectedCrime ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {CYBER_CRIMES.map((crime) => (
                  <button key={crime.id} onClick={() => setSelectedCrime(crime)} className="bg-[var(--surface)] p-5 md:p-8 rounded-xl md:rounded-2xl text-left border border-[var(--border)] hover:border-emerald-500/20 transition-all group shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:text-emerald-500">
                      <i className={`fas ${crime.icon} text-base md:text-lg`}></i>
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-[var(--text-main)] mb-1.5">{crime.title}</h3>
                    <p className="text-[10px] md:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">{crime.shortDesc}</p>
                    <div className="mt-4 pt-4 border-t border-[var(--border)] text-[8px] md:text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Learn More &rarr;</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <button onClick={() => setSelectedCrime(null)} className="px-4 py-2 bg-[var(--surface)] rounded-lg border border-[var(--border)] text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2">
                  <i className="fas fa-arrow-left"></i> Back to Library
                </button>
                <div className="bg-[var(--surface)] rounded-[1.5rem] md:rounded-[2.5rem] border border-[var(--border)] overflow-hidden shadow-lg">
                   <div className="p-6 md:p-12 guardian-gradient text-white flex flex-col md:flex-row items-center gap-4 md:gap-8">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl"><i className={`fas ${selectedCrime.icon}`}></i></div>
                      <h1 className="text-xl md:text-4xl font-black text-center md:text-left">{selectedCrime.title}</h1>
                   </div>
                   <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                     <div className="space-y-6">
                       <section><h4 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Analysis</h4><p className="text-[12px] md:text-lg text-[var(--text-main)] leading-relaxed">{selectedCrime.whatIsIt}</p></section>
                       <section><h4 className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-2">Methodology</h4><p className="text-[12px] md:text-base text-[var(--text-muted)] leading-relaxed">{selectedCrime.howItHappens}</p></section>
                     </div>
                     <div className="space-y-6">
                       <div className="bg-black/5 dark:bg-slate-900/40 p-5 md:p-8 rounded-xl md:rounded-2xl border border-[var(--border)]"><h4 className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Incident Example</h4><p className="text-[11px] md:text-base text-[var(--text-muted)] italic">"{selectedCrime.example}"</p></div>
                       <div className="bg-emerald-500/5 p-5 md:p-8 rounded-xl md:rounded-2xl border border-emerald-500/10"><h4 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-4">Prevention</h4><ul className="space-y-3">{selectedCrime.prevention.map((tip, idx) => (<li key={idx} className="flex items-start gap-3 text-[11px] md:text-sm font-semibold text-[var(--text-main)]"><i className="fas fa-check-circle text-emerald-500 mt-0.5 text-[10px]"></i><span>{tip}</span></li>))}</ul></div>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'safety' && (
          <div className="space-y-8 md:space-y-12 animate-slide-up">
            <header className="space-y-3 md:space-y-6 max-w-3xl">
              <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Fortification Protocols</div>
              <h2 className="text-2xl md:text-5xl font-extrabold uppercase leading-tight tracking-tight">Rules for <span className="text-emerald-500">Total Safety.</span></h2>
              <p className="text-[12px] md:text-lg text-[var(--text-muted)] leading-relaxed font-medium">Deploy these layered defenses across your digital environment.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {[
                { t: 'Zero-Trust', i: 'fa-shield-halved', d: 'Assume every link is compromised until verified through multiple channels.' },
                { t: 'Advanced Credentials', i: 'fa-key', d: 'Replace weak passwords with hardware keys or biometric passkeys.' }
              ].map((p, i) => (
                <div key={i} className="bg-[var(--surface)] p-6 md:p-10 rounded-xl md:rounded-[2.5rem] border border-[var(--border)] shadow-sm">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-emerald-500 mb-6"><i className={`fas ${p.i} text-lg`}></i></div>
                  <h4 className="text-lg md:text-2xl font-bold mb-3 uppercase tracking-tight">{p.t}</h4>
                  <p className="text-[11px] md:text-base text-[var(--text-muted)] leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
            <section className="bg-[var(--surface)] p-6 md:p-10 rounded-xl md:rounded-[2.5rem] border border-[var(--border)] shadow-sm space-y-6">
              <h3 className="text-lg md:text-2xl font-bold uppercase tracking-tight">Stealth Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {[
                  'Enable Multi-Factor Authentication (MFA) on all accounts.',
                  'Regularly backup data to encrypted offline storage.',
                  'Weekly permission review for mobile apps.',
                  'Use hardware-secured secondary email IDs.',
                  'Physical camera covers for all portable devices.',
                  'Disable Wi-Fi & Bluetooth auto-connect in public.',
                  'Enforce SIM card PIN locking for identity theft protection.',
                  'Audit shared document access in cloud storage regularly.',
                  'Purge inactive accounts and delete unused apps.',
                  'Use a reputable password manager for unique logins.',
                  'Avoid public USB charging ports (Juice Jacking).',
                  'Verify email sender identity before clicking links.'
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border)]">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[8px]"><i className="fas fa-check"></i></div>
                    <span className="text-[11px] md:text-sm font-semibold">{check}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentPage === 'quiz' && (
          <div className="max-w-2xl mx-auto py-6 md:py-12 animate-slide-up">
            {!quizState.active ? (
              <div className="text-center p-8 md:p-12 bg-[var(--surface)] rounded-xl md:rounded-[2.5rem] border border-[var(--border)] space-y-6 md:space-y-8 shadow-sm">
                <div className="w-16 h-16 md:w-20 md:h-20 guardian-gradient rounded-xl md:rounded-2xl flex items-center justify-center mx-auto text-white text-2xl md:text-3xl shadow-xl"><i className="fas fa-brain"></i></div>
                <h2 className="text-xl md:text-4xl font-extrabold uppercase">Knowledge Lab</h2>
                <p className="text-[12px] md:text-base text-[var(--text-muted)] px-4">Test your awareness against modern threat patterns and defensive rules. (10 random questions each attempt)</p>
                <button onClick={startQuiz} className="w-full py-4 guardian-gradient rounded-xl font-bold text-white text-[10px] md:text-xs uppercase tracking-widest shadow-lg active:scale-95">Begin Test</button>
              </div>
            ) : quizState.finished ? (
              <div className="text-center p-8 md:p-12 bg-[var(--surface)] rounded-xl md:rounded-[2.5rem] border border-[var(--border)] space-y-8 animate-slide-up">
                <div className="text-4xl md:text-6xl">🏆</div>
                <h2 className="text-xl md:text-4xl font-extrabold uppercase">Audit Result</h2>
                <div className="bg-emerald-500/10 inline-flex flex-col items-center px-10 md:px-16 py-6 md:py-8 rounded-xl md:rounded-[2rem] border border-emerald-500/20">
                  <div className="text-3xl md:text-6xl font-black text-emerald-500">{quizState.score} / {quizState.questions.length}</div>
                  <span className="text-[8px] md:text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em] mt-2">Proficiency Level</span>
                </div>
                <p className="text-[12px] md:text-lg font-medium">{quizState.score >= 8 ? "Advanced Security Consciousness." : "Further training recommended."}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={startQuiz} className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg">Try New Questions</button>
                  <button onClick={() => navigate('home')} className="w-full py-4 guardian-gradient rounded-xl font-bold text-white text-[10px] md:text-xs uppercase tracking-widest shadow-lg">Return Dashboard</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-10">
                <div className="flex justify-between items-end border-b border-[var(--border)] pb-4">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Question {quizState.currentIdx + 1}/10</span>
                  <div className="h-1.5 w-24 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((quizState.currentIdx + 1) / 10) * 100}%` }}></div>
                  </div>
                </div>
                
                <h3 className="text-lg md:text-2xl font-bold leading-tight">{quizState.questions[quizState.currentIdx]?.question}</h3>
                
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {quizState.questions[quizState.currentIdx]?.options.map((opt, i) => {
                    const isCorrect = i === quizState.questions[quizState.currentIdx].answer;
                    const isSelected = i === quizState.selectedOption;
                    let buttonClass = "bg-[var(--surface)] border-[var(--border)] opacity-100 hover:border-emerald-500/30";
                    
                    if (quizState.showFeedback) {
                      if (isCorrect) {
                        buttonClass = "bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500";
                      } else if (isSelected) {
                        buttonClass = "bg-red-500/20 border-red-500 opacity-80";
                      } else {
                        buttonClass = "bg-[var(--surface)] border-[var(--border)] opacity-40 grayscale";
                      }
                    }

                    return (
                      <button 
                        key={i} 
                        onClick={() => handleQuizAnswer(i)} 
                        disabled={quizState.showFeedback}
                        className={`p-4 md:p-6 text-left rounded-xl border transition-all flex items-center gap-4 group ${buttonClass} ${!quizState.showFeedback ? 'active:scale-[0.98]' : ''}`}
                      >
                        <span className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-[10px] md:text-xs transition-colors ${
                          quizState.showFeedback && isCorrect ? 'bg-emerald-500 text-white' :
                          quizState.showFeedback && isSelected ? 'bg-red-500 text-white' :
                          'bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500 group-hover:text-white'
                        }`}>{String.fromCharCode(65 + i)}</span>
                        <span className="text-[12px] md:text-base font-semibold flex-1">{opt}</span>
                        {quizState.showFeedback && isCorrect && <i className="fas fa-circle-check text-emerald-500"></i>}
                        {quizState.showFeedback && isSelected && !isCorrect && <i className="fas fa-circle-xmark text-red-500"></i>}
                      </button>
                    );
                  })}
                </div>

                {quizState.showFeedback && (
                  <div className="p-6 md:p-8 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--border)] animate-slide-up space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${quizState.selectedOption === quizState.questions[quizState.currentIdx].answer ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        <i className={`fas ${quizState.selectedOption === quizState.questions[quizState.currentIdx].answer ? 'fa-star' : 'fa-lightbulb'}`}></i>
                      </div>
                      <h4 className={`font-bold text-xs md:text-sm uppercase tracking-widest ${quizState.selectedOption === quizState.questions[quizState.currentIdx].answer ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {quizState.selectedOption === quizState.questions[quizState.currentIdx].answer ? 'Great Job!' : 'Keep Learning!'}
                      </h4>
                    </div>
                    <p className="text-[11px] md:text-sm text-[var(--text-main)] font-medium leading-relaxed italic">
                      "{quizState.questions[quizState.currentIdx].explanation}"
                    </p>
                    <button 
                      onClick={handleNextQuestion} 
                      className="w-full py-4 guardian-gradient text-white font-bold rounded-xl text-[10px] md:text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      {quizState.currentIdx + 1 === quizState.questions.length ? 'See Results' : 'Continue'}
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentPage === 'report' && (
          <div className="space-y-8 md:space-y-12 animate-slide-up">
            <div className="border-l-3 border-emerald-500 pl-3 md:pl-5">
              <h2 className="text-xl md:text-4xl font-extrabold text-[var(--text-main)] uppercase tracking-tight">Reporting Center</h2>
              <p className="text-[var(--text-muted)] font-medium mt-1 text-[10px] md:text-base">Official remediation & recovery channels.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { t: 'Vulnerable Groups', s: 'WOMEN & CHILDREN', u: 'https://cybercrime.gov.in/Webform/Index.aspx' },
                { t: 'Financial Fraud', s: 'ASSETS & BANKING', u: 'https://cybercrime.gov.in/Webform/Index.aspx' },
                { t: 'Advanced Threats', s: 'OTHER CRIMES', u: 'https://cybercrime.gov.in/Webform/Index.aspx' }
              ].map((card, i) => (
                <div key={i} className="p-5 md:p-8 bg-[var(--surface)] rounded-xl md:rounded-2xl border border-[var(--border)] space-y-4">
                  <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">{card.s}</div>
                  <h3 className="text-sm md:text-lg font-bold uppercase">{card.t}</h3>
                  <a href={card.u} target="_blank" className="block py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-widest text-center rounded-lg border border-emerald-500/10 transition-all">Submit Report</a>
                </div>
              ))}
            </div>
            <div className="bg-red-500/5 p-6 md:p-10 rounded-xl md:rounded-[2.5rem] border border-red-500/10 text-center space-y-4 md:space-y-6">
              <i className="fas fa-phone-volume text-3xl md:text-4xl text-red-500/80"></i>
              <div className="space-y-1">
                <h4 className="text-lg md:text-2xl font-bold uppercase tracking-tight text-red-500">Emergency Response</h4>
                <p className="text-[10px] md:text-sm text-[var(--text-muted)] font-medium">Financial breaches require immediate 1930 remediation.</p>
              </div>
              <a href="tel:1930" className="block bg-red-500/10 py-4 md:py-6 rounded-lg md:rounded-2xl text-3xl md:text-5 font-black tracking-tighter hover:bg-red-500/20 transition-all">1930</a>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden soft-glass fixed bottom-0 left-0 right-0 flex border-t border-[var(--border)] px-1 pb-safe z-50 rounded-t-xl shadow-lg">
        <NavItem page="home" icon="fa-grip" label="Home" mobile />
        <NavItem page="crimes" icon="fa-fingerprint" label="Library" mobile />
        <NavItem page="safety" icon="fa-shield-halved" label="Rules" mobile />
        <NavItem page="quiz" icon="fa-brain" label="Quiz" mobile />
        <NavItem page="report" icon="fa-file-signature" label="Report" mobile />
      </nav>

      {/* Auxiliary Components */}
      <SecurityDiagnostic isOpen={isDiagnosticOpen} onClose={() => setIsDiagnosticOpen(false)} />
    </div>
  );
};

export default App;