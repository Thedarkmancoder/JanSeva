
import React, { useState, useRef } from 'react';
import { FileText, Search, Upload, Loader2, BookOpen, ShieldAlert, CheckCircle2, AlertCircle, FileUp, Sparkles } from 'lucide-react';
import { analyzeDocument } from '../services/geminiService';
// We'll use the GlobalWorkerOptions to set up PDF.js in the browser
import * as pdfjsLib from 'https://esm.sh/pdfjs-dist@4.0.379';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs';

interface LibraryDoc {
  id: string;
  title: string;
  type: string;
  date: string;
  content: string;
  isNew?: boolean;
}

const DocumentHub: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [libraryDocs, setLibraryDocs] = useState<LibraryDoc[]>([
    { id: '1', title: "First Aid Protocols", type: "Manual", date: "Oct 2023", content: "Initial medical response procedures for common accidents..." },
    { id: '2', title: "Traffic Safety Act 2023", type: "Regulation", date: "Sep 2023", content: "Updated traffic rules and penalties for Chhattisgarh state..." },
    { id: '3', title: "Hospital ER Checklist", type: "Guideline", date: "Nov 2023", content: "Mandatory steps for emergency room intake and triage..." },
  ]);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeDocument(content);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze document. Please check your AI configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError("Please select a valid PDF file.");
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
          }

          setContent(fullText);
          
          // Add to local library
          const newDoc: LibraryDoc = {
            id: Date.now().toString(),
            title: file.name.replace('.pdf', ''),
            type: "Imported",
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            content: fullText,
            isNew: true
          };
          setLibraryDocs(prev => [newDoc, ...prev]);
          setIsExtracting(false);
        } catch (err) {
          console.error("PDF Parsing error:", err);
          setError("Failed to parse PDF content. The file might be corrupted or protected.");
          setIsExtracting(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Error reading file.");
      setIsExtracting(false);
    }
  };

  const selectDoc = (doc: LibraryDoc) => {
    setContent(doc.content);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf" 
        className="hidden" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Library */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h4 className="font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-500" /> Resource Library
            </h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {libraryDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  onClick={() => selectDoc(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                    content === doc.content 
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/30'
                  }`}
                >
                  {doc.isNew && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-tighter">
                      Recently Parsed
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <FileText className={`w-5 h-5 transition-colors ${content === doc.content ? 'text-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black mt-1 tracking-widest">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="w-full mt-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-red-400 dark:hover:border-red-900/50 transition-all flex items-center justify-center gap-2 group"
            >
              {isExtracting ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              ) : (
                <FileUp className="w-4 h-4 group-hover:text-red-500 transition-colors" />
              )}
              {isExtracting ? 'PARSING PDF...' : 'IMPORT PDF CONTENT'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
            <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
            <h5 className="font-black text-sm mb-2 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Pro Tip
            </h5>
            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
              Import accident manuals or insurance policies to extract immediate emergency action points using Gemini AI.
            </p>
          </div>
        </div>

        {/* AI Analysis Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-all duration-300 relative overflow-hidden">
            {isExtracting && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/40">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-[0.2em]">Reading Document Data...</p>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">AI Document Intelligence</h3>
                <p className="text-sm text-slate-400">Extract insights from PDF text or emergency manuals</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-red-500" />
                 <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Gemini Engine</span>
              </div>
            </div>

            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste content from PDF or manual here for AI summarization..."
              className="w-full min-h-[250px] p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-slate-800 dark:text-slate-200 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner custom-scrollbar"
            />

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || isExtracting || !content.trim()}
              className="w-full mt-6 py-5 bg-slate-900 dark:bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-black dark:hover:bg-red-700 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>ANALYZING CONTENT...</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  <span>DECRYPT & SUMMARIZE</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl animate-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Analysis Results</h4>
              </div>

              <div className="space-y-8">
                <div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">EXECUTIVE SUMMARY</h5>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic border-l-4 border-red-500 pl-6 py-1 bg-slate-50 dark:bg-slate-800/30 rounded-r-xl">
                    {result.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SAFETY PROTOCOLS</h5>
                    <div className="space-y-2">
                      {result.safetyPoints.map((p: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ACTIONABLE INSIGHTS</h5>
                    <div className="space-y-2">
                      {result.insights.map((p: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentHub;
