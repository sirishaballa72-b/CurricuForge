
import React, { useState, useCallback } from 'react';
import { Curriculum, GenerationParams } from './types';
import { generateCurriculum } from './services/geminiService';
import { CurriculumDisplay } from './components/CurriculumDisplay';
import { Button } from './components/ui/Button';
import { Sparkles, Hammer, BookOpen, GraduationCap, ArrowRight, Download, Share2, PlusCircle, Zap, Target } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<GenerationParams>({
    subject: '',
    level: 'Undergraduate',
    duration: '12 Weeks',
    focus: 'Practical skills and theoretical foundations',
    industryAlignment: true
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError("Please specify a subject.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateCurriculum(formData);
      setCurriculum(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate curriculum. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (!curriculum) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(curriculum, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `CurricuForge_${curriculum.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [curriculum]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setCurriculum(null)}>
            <div className="bg-indigo-600 p-2 rounded-lg transition-transform group-hover:scale-110">
              <Hammer className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Curricu<span className="text-indigo-600">Forge</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Templates</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Library</a>
            <Button variant="outline" className="text-xs h-8">Account</Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {!curriculum ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Next-Gen Academic Engineering
              </div>
              <h2 className="text-5xl font-black text-slate-900 leading-tight">
                Architect World-Class <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Learning Paths</span> In Seconds.
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                CurricuForge uses advanced Generative AI to design industry-aligned, structured courses, learning outcomes, and module-by-module topics for educators and trainers.
              </p>
            </div>

            {/* Generator Form */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
              <form onSubmit={handleGenerate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" /> Subject or Course Title
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Advanced Quantum Computing, Modern Web Architecture..." 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-500" /> Academic Level
                    </label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                      value={formData.level}
                      onChange={e => setFormData({...formData, level: e.target.value})}
                    >
                      <option>High School</option>
                      <option>Undergraduate</option>
                      <option>Graduate / Master's</option>
                      <option>Professional Certification</option>
                      <option>Corporate Training</option>
                      <option>Bootcamp</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-indigo-500" /> Program Duration
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 12 Weeks, 6 Months, 40 Hours" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-8">
                     <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.industryAlignment}
                        onChange={e => setFormData({...formData, industryAlignment: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ms-3 text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${formData.industryAlignment ? 'text-amber-500' : 'text-slate-400'}`} /> Industry Aligned
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Strategic Focus & Learning Constraints</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide specific areas you want to emphasize, prerequisites, or specific pedagogical approaches..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                    value={formData.focus}
                    onChange={e => setFormData({...formData, focus: e.target.value})}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg" 
                  isLoading={loading}
                >
                  Generate Curriculum Architecture
                </Button>
              </form>
            </div>

            {/* Features Row */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'AI Outcome Mapping', desc: 'Automatically map module content to high-level academic learning objectives.', icon: <Target className="w-6 h-6 text-indigo-500" /> },
                { title: 'Industry Optimized', desc: 'Leverages trend analysis to ensure curriculum meets current market demands.', icon: <Zap className="w-6 h-6 text-amber-500" /> },
                { title: 'Standard Export', desc: 'Export your curriculum to standard formats for LMS ingestion or review.', icon: <Download className="w-6 h-6 text-emerald-500" /> },
              ].map((f, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">{f.icon}</div>
                  <h4 className="font-bold text-slate-800 mb-2">{f.title}</h4>
                  <p className="text-slate-500 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Results Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                 <Button variant="ghost" onClick={() => setCurriculum(null)} className="text-slate-500">
                    <ArrowRight className="w-4 h-4 rotate-180 mr-2" /> Back to Generator
                 </Button>
                 <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                 <h3 className="text-sm font-bold text-slate-500 hidden md:block">VIEWING ARCHITECTURE: <span className="text-indigo-600 uppercase">{curriculum.title}</span></h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleDownload} className="text-sm">
                  <Download className="w-4 h-4 mr-2" /> Export JSON
                </Button>
                <Button variant="outline" className="text-sm">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button variant="primary" onClick={() => setCurriculum(null)} className="text-sm">
                  <PlusCircle className="w-4 h-4 mr-2" /> Create New
                </Button>
              </div>
            </div>

            <CurriculumDisplay curriculum={curriculum} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Hammer className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Curricu<span className="text-indigo-500">Forge</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CurricuForge AI. Empowering educators with generative intelligence.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
