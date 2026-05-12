/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare, 
  RefreshCcw, 
  Search, 
  X, 
  Scale, 
  Brain, 
  Info,
  CheckCircle2,
  AlertCircle,
  Zap, 
  Calendar, 
  Users, 
  Target,
  Flame,
  Fingerprint,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { analyzeContent, FactCheckResult } from './services/geminiService';
import { cn } from './lib/utils';
import Markdown from 'react-markdown';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContent(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case 'Likely True': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Possibly Misleading': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Likely False': return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-900/20">
              T
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-white leading-tight">TruthGuard AI</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Veritas Analysis Engine</p>
            </div>
          </div>
          {result && (
            <div className="bg-brand-card px-4 py-2 rounded-xl border border-brand-border hidden md:block">
              <span className="block text-[10px] text-slate-500 uppercase mb-1 font-bold">Analysis Status</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm text-slate-200 font-medium tracking-tight">Real-time Verified</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-16">
        {/* Intro */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight mb-4">
            Verify Reality, <span className="text-indigo-400">Instantly.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Unmask misinformation with deep contextual analysis. Advanced forensics for the digital era.
          </p>
        </div>

        {/* Input Section */}
        <section className="bg-brand-card rounded-3xl shadow-2xl border border-brand-border p-8 mb-16 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative">
            <textarea
              id="content-input"
              className="w-full min-h-[160px] p-6 rounded-2xl border border-brand-border focus:border-indigo-500/50 bg-brand-bg/50 outline-none transition-all resize-none text-slate-200 placeholder:text-slate-600 font-medium"
              placeholder="Paste content here to analyze..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
              <button 
                onClick={() => setInput('')}
                className="absolute top-6 right-6 p-1.5 hover:bg-slate-800 rounded-full transition-colors"
                id="clear-input-btn"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              id="analyze-btn"
              disabled={loading || !input.trim()}
              onClick={handleAnalyze}
              className={cn(
                "flex items-center gap-2 px-10 py-4 rounded-xl font-bold transition-all",
                loading || !input.trim() 
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700" 
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-95 border border-indigo-400/20"
              )}
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Submit Analysis
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-5 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3"
              id="error-message"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-semibold tracking-tight">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
              id="results-container"
            >
              {/* Summary Score & Verdict */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 bg-brand-card rounded-3xl p-10 border border-brand-border shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={cn("px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border", getVerdictStyles(result.top_bar.verdict))}>
                        {result.top_bar.verdict}
                      </div>
                      <div className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                        Confidence: {result.confidence}
                      </div>
                    </div>
                    <h2 className="text-3xl font-display font-medium text-white leading-tight mb-6">{result.one_line_summary}</h2>
                  </div>
                  <div className="flex items-center gap-4 pt-8 border-t border-slate-800/50">
                    <Info className="w-5 h-5 text-indigo-400 shrink-0" />
                    <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-tight">Systemic analysis utilizing heuristic cross-referencing and behavioral weights.</p>
                  </div>
                </div>

                <div className="md:col-span-4 bg-brand-card rounded-3xl p-10 border border-brand-border shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50" />
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="72"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-slate-800"
                      />
                      <motion.circle
                        initial={{ strokeDasharray: "0 452" }}
                        animate={{ strokeDasharray: `${(result.top_bar.credibility / 100) * 452} 452` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        cx="80"
                        cy="80"
                        r="72"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeLinecap="round"
                        className={getScoreColor(result.top_bar.credibility)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn("text-6xl font-display font-bold leading-none tracking-tighter", getScoreColor(result.top_bar.credibility))}>
                        {result.top_bar.credibility}
                      </span>
                    </div>
                  </div>
                  <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-xs">Credibility Index</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest leading-none">Security Metric Grade</p>
                </div>
              </div>

              {/* Final Verdict Banner */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "p-6 rounded-2xl border flex items-center gap-4 shadow-xl",
                  getVerdictStyles(result.top_bar.verdict)
                )}
              >
                <Fingerprint className="w-8 h-8 shrink-0" />
                <div className="text-lg font-display font-medium leading-tight">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black uppercase tracking-widest text-xs block opacity-60">System Recommendation</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.user_action.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Analysis Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-brand-card p-6 rounded-3xl border border-brand-border">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Timeline Check</p>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-lg", result.timeline_check.issue === 'Yes' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400')}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{result.timeline_check.issue === 'Yes' ? 'Chronology Error' : 'Consistent'}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{result.timeline_check.details}</p>
                </div>

                <div className="bg-brand-card p-6 rounded-3xl border border-brand-border">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Social Risk</p>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg", 
                      result.real_world_impact.risk === 'High' ? 'bg-rose-500/10 text-rose-400' : 
                      result.real_world_impact.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    )}>
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{result.real_world_impact.risk} Risk</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{result.real_world_impact.impact}</p>
                </div>

                <div className="bg-brand-card p-6 rounded-3xl border border-brand-border">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Psychological Triggers</p>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{result.psychological_triggers.length} Found</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-1 capitalize">{result.psychological_triggers.map(t => t.type).join(', ')}</p>
                </div>

                <div className="bg-brand-card p-6 rounded-3xl border border-brand-border">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Confidence</p>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{result.confidence} Probability</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Analysis depth saturation</p>
                </div>
              </div>

              {/* Detailed Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Key Issues */}
                <div className="bg-brand-card rounded-3xl p-10 border border-brand-border shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Key Inconsistencies</h3>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 tracking-widest">{result.key_issues.length} DETECTED</span>
                  </div>
                  <ul className="space-y-4">
                    {result.key_issues.map((issue, idx) => (
                      <li key={idx} className="flex gap-4 text-slate-300 p-4 bg-brand-bg/40 rounded-2xl border border-slate-800/50 hover:border-amber-500/30 transition-colors">
                        <AlertCircle className="w-4 h-4 text-amber-500/70 mt-1 shrink-0" />
                        <span className="text-sm font-medium leading-relaxed">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Psychological Triggers */}
                <div className="bg-brand-card rounded-3xl p-10 border border-brand-border shadow-lg">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <Flame className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Psychological Vectors</h3>
                  </div>
                  <div className="space-y-6">
                    {result.psychological_triggers.map((trigger, idx) => (
                      <div key={idx} className="p-5 bg-brand-bg/40 rounded-2xl border border-slate-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Type: {trigger.type}</span>
                        </div>
                        <p className="text-slate-400 text-sm italic leading-relaxed">"{trigger.example}"</p>
                      </div>
                    ))}
                    {result.psychological_triggers.length === 0 && (
                      <p className="text-slate-600 italic text-sm">No manipulative psychological triggers identified.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comparison Matrix */}
              <div className="bg-brand-card rounded-3xl border border-brand-border overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-10 border-b md:border-b-0 md:border-r border-brand-border bg-rose-500/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-rose-300/70">Original Narrative</h4>
                    </div>
                    <p className="text-slate-300 italic text-lg leading-relaxed">"{input}"</p>
                  </div>
                  <div className="p-10 bg-emerald-500/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300/70">Corrected Paradigm</h4>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed font-medium">"{result.corrected_version}"</p>
                  </div>
                </div>
              </div>

              {/* Manipulation Tactics */}
              <div className="bg-brand-card rounded-3xl p-10 border border-brand-border shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-zinc-800 rounded-xl">
                    <Brain className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Manipulation Heuristics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.why_it_tricks_people.map((tactic, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-6 bg-brand-bg/40 rounded-2xl border border-slate-800/50">
                      <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">{tactic}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentence Analysis */}
              <div className="bg-brand-card rounded-3xl p-10 border border-brand-border shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-zinc-800 rounded-xl">
                    <Search className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Micro-Narrative Forensics</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="py-4 pr-6 text-[10px] font-black text-slate-600 uppercase tracking-widest w-1/2">Segment</th>
                        <th className="py-4 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {result.highlighted_flags.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-brand-bg/50 transition-colors">
                          <td className="py-6 pr-6">
                            <p className="text-sm text-slate-200 font-medium leading-relaxed">"{item.text}"</p>
                          </td>
                          <td className="py-6 px-6 align-top">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border whitespace-nowrap",
                              item.risk === 'High' ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' :
                              item.risk === 'Medium' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                              'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                            )}>
                              {item.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fact Check Explanation */}
              <div className="bg-brand-card rounded-3xl p-10 border border-brand-border shadow-lg space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Full Heuristic Breakdown</h3>
                </div>
                <div className="prose prose-invert prose-brand prose-sm max-w-none text-slate-300 leading-loose">
                  <Markdown>{result.explanation}</Markdown>
                </div>
              </div>

              {/* Truthful Rewrite */}
              <div className="bg-blue-900/40 rounded-3xl p-10 text-white shadow-2xl border border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight">Truthful Rewrite v1.0</h3>
                </div>
                <div className="text-slate-200 leading-relaxed font-semibold bg-brand-bg/60 p-8 rounded-2xl border border-blue-500/20 italic shadow-inner">
                  "{result.truthful_rewrite}"
                </div>
                <div className="mt-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Neutrality Verified</span>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.truthful_rewrite)}
                    className="px-6 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-blue-500/30 active:scale-95"
                  >
                    Copy Output
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer Info */}
      <footer className={cn("mt-32 py-16 border-t border-brand-border text-center", !result && "fixed bottom-0 w-full bg-brand-bg/80 backdrop-blur-md")}>
        <div className="max-w-xl mx-auto px-6">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em] mb-4">Automated Cognitive Assistance</p>
          <p className="text-slate-500 text-xs leading-relaxed">
            TruthGuard AI is a predictive heuristic engine. All outputs should be cross-verified with authoritative cryptographic or peer-reviewed primary sources.
          </p>
        </div>
      </footer>
    </div>
  );
}
