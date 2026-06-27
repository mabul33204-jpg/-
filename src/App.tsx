import React, { useState, useRef } from "react";
import { SAMPLE_PRESETS } from "./data/presets";
import { InputFormData } from "./types";
import CrisisBanner from "./components/CrisisBanner";
import HardGateWarning from "./components/HardGateWarning";
import { 
  FileText, Target, Calendar, UserCheck, Layers, Play, Sparkles, 
  RefreshCw, CheckCircle2, Copy, Check, ShieldCheck, AlertTriangle,
  HelpCircle, ChevronRight, BookOpen, Send, Zap, ShieldAlert, Cpu, Home,
  UploadCloud, Paperclip, Loader2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [formData, setFormData] = useState<InputFormData>({
    documentData: SAMPLE_PRESETS[0].data.documentData,
    jobGoal: SAMPLE_PRESETS[0].data.jobGoal,
    baseYear: "2026",
    executionDate: new Date().toISOString().split("T")[0],
    participationInfo: SAMPLE_PRESETS[0].data.participationInfo,
    outputMode: "ALL"
  });

  const [additionalMessage, setAdditionalMessage] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("tech-youth");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "result" | "guide">("form");
  const [showLanding, setShowLanding] = useState(true);

  // File Parsing States
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [parseDocStatus, setParseDocStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadProcess = async (file: File) => {
    if (!file) return;
    const allowed = [".pdf", ".docx", ".txt"];
    const lowerName = file.name.toLowerCase();
    if (!allowed.some(ext => lowerName.endsWith(ext))) {
      setParseDocStatus({ type: "error", text: "PDF, TXT, DOCX 파일만 업로드 가능합니다." });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setParseDocStatus({ type: "error", text: "파일 크기는 최대 20MB까지 가능합니다." });
      return;
    }

    setIsParsingDoc(true);
    setParseDocStatus(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64OrData = reader.result as string;
        try {
          const res = await fetch("/api/parse-document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileData: base64OrData, fileName: file.name })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setFormData(prev => ({
              ...prev,
              documentData: prev.documentData 
                ? `${prev.documentData}\n\n[첨부서류 (${file.name}) 추출 내용]:\n${data.text}`
                : `[첨부서류 (${file.name}) 추출 내용]:\n${data.text}`
            }));
            setParseDocStatus({ type: "success", text: `${file.name} 서류 텍스트 추출이 완료되었습니다.` });
          } else {
            setParseDocStatus({ type: "error", text: data.error || "문서 파싱에 실패했습니다." });
          }
        } catch (err) {
          setParseDocStatus({ type: "error", text: "서버 파싱 요청 중 오류가 발생했습니다." });
        } finally {
          setIsParsingDoc(false);
        }
      };
      reader.onerror = () => {
        setParseDocStatus({ type: "error", text: "파일을 읽는 중 오류가 발생했습니다." });
        setIsParsingDoc(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setParseDocStatus({ type: "error", text: "업로드 처리 실패" });
      setIsParsingDoc(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUploadProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEnterWorkspace = (initialTab?: "form" | "result" | "guide") => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    setShowLanding(false);
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = SAMPLE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setFormData(preset.data);
      setAnalysisResult(null);
      setErrorMessage(null);
    }
  };

  const handleInputChange = (field: keyof InputFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const runAnalysis = async () => {
    setLoading(true);
    setErrorMessage(null);
    setActiveTab("result");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          additionalMessage,
          apiKey: localStorage.getItem("GEMINI_API_KEY") || ""
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "서버 분석 요청 중 오류가 발생했습니다.");
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setErrorMessage(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to detect hard gate trigger in raw result
  const detectGateTrigger = (text: string | null) => {
    if (!text) return null;
    if (text.includes("1577-0199") || text.includes("정신건강위기") || text.includes("위기 우선")) {
      return "CRISIS_G1";
    }
    if (text.includes("입력된 서류 데이터가 없어 정확한 분석이 불가")) {
      return "MISSING_DATA_COND1";
    }
    if (text.includes("서류 기반 추정 방향 최대 3가지") || text.includes("가설 방향을 추출")) {
      return "AMBIGUOUS_COND2";
    }
    return null;
  };

  const gateTrigger = detectGateTrigger(analysisResult);

  if (showLanding) {
    return <LandingPage onEnterWorkspace={handleEnterWorkspace} />;
  }

  return (
    <div className="min-h-screen bg-[#011c16] font-sans text-slate-800 flex flex-col antialiased selection:bg-emerald-600 selection:text-white">
      {/* Top G1 Hard Gate Notice Banner */}
      <CrisisBanner />

      {/* Main Header (Deep Forest Green Base) */}
      <header className="bg-[#022c22] text-white shadow-xl border-b border-emerald-900/60 sticky top-0 z-40 backdrop-blur-md bg-[#022c22]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-tr from-[#064e3b] via-[#047857] to-emerald-400 p-3 rounded-2xl shadow-lg shadow-black/20 ring-1 ring-emerald-300/30 flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>국민취업지원제도 실무 특화 전략 엔진</span>
                </h1>
                <span className="bg-amber-400/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider border border-amber-400/40">
                  PRO ENGINE v1.0
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1 flex items-center gap-1.5 font-normal">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0 inline" />
                <span>상담사 분석 보조 도구 (참여자 동기·심리 단정 금지 / 서류상 추정 가설 원칙 준수)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end md:self-auto text-xs bg-black/30 p-1.5 rounded-2xl border border-emerald-800/60 shadow-inner">
            <button
              onClick={() => setShowLanding(true)}
              className="px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer font-medium text-emerald-200/70 hover:text-white hover:bg-[#064e3b]/80 border-r border-emerald-800/80 mr-0.5 pr-3.5"
              title="홈 랜딩페이지로 이동"
            >
              <Home className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">홈</span>
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                activeTab === "form" 
                  ? "bg-gradient-to-r from-[#ebd5b3] via-[#e2c499] to-[#d8b27f] text-[#2c1c0c] shadow-md font-extrabold" 
                  : "text-emerald-200/70 hover:text-white hover:bg-[#064e3b]/60"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> 데이터 입력
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer relative font-medium ${
                activeTab === "result" 
                  ? "bg-gradient-to-r from-[#ebd5b3] via-[#e2c499] to-[#d8b27f] text-[#2c1c0c] shadow-md font-extrabold" 
                  : "text-emerald-200/70 hover:text-white hover:bg-[#064e3b]/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 분석 출력
              {analysisResult && (
                <span className="w-2 h-2 bg-amber-300 rounded-full absolute -top-0.5 -right-0.5 shadow-xs ring-2 ring-[#022c22] animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                activeTab === "guide" 
                  ? "bg-gradient-to-r from-[#ebd5b3] via-[#e2c499] to-[#d8b27f] text-[#2c1c0c] shadow-md font-extrabold" 
                  : "text-emerald-200/70 hover:text-white hover:bg-[#064e3b]/60"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> 엔진 가이드
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Top Section: Input Form (Shows full width on mobile or if tab is form) */}
        <div className={`lg:col-span-5 space-y-6 ${activeTab !== "form" ? "hidden lg:block" : ""}`}>
          
          {/* Presets Quick Loader Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 transition-all hover:border-slate-300">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500 border border-amber-200/60">
                  <Zap className="w-4 h-4 fill-amber-500" />
                </div>
                <span>현장 테스트 템플릿 프리셋</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded font-semibold">Quick Cases</span>
            </div>
            
            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-normal">
              프롬프트의 하드 게이트(G1 위기, G2 부정수급 방지) 및 사전 처리 규칙(서류 누락 등)을 즉시 테스트할 수 있는 대표 검증 시나리오입니다.
            </p>

            <div className="space-y-2.5">
              {SAMPLE_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                const isCrisis = preset.id === "crisis-signal";
                const isMissing = preset.id === "missing-data";
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1.5 relative ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-50/90 to-indigo-50/50 border-blue-500 shadow-sm text-blue-950 ring-1 ring-blue-500/30"
                        : "bg-slate-50/50 hover:bg-slate-100/80 border-slate-200/80 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold flex items-center gap-1.5 text-slate-900 text-[13px]">
                        {preset.title}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 font-bold ${
                        isCrisis 
                          ? "bg-red-100 text-red-700 border border-red-200" 
                          : isMissing 
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-white text-slate-600 border border-slate-200 shadow-2xs"
                      }`}>
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 font-normal leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main XML Isolated Input Form Box */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 relative transition-all hover:border-slate-300">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200/60">
                  <Target className="w-4 h-4" />
                </div>
                <span>격리 데이터 입력 (&lt;input&gt; 태그 내 삽입)</span>
              </div>
              <span className="text-[10px] bg-slate-900 text-slate-100 font-mono font-bold px-2 py-1 rounded shadow-2xs">
                XML ISOLATION
              </span>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* 서류 첨부 영역 (PDF, TXT, MS DOCX 자동 파싱) */}
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => !isParsingDoc && fileInputRef.current?.click()}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-blue-50/50 border-2 border-dashed border-indigo-200/80 hover:border-[#6366f1] transition-all duration-200 cursor-pointer text-center relative group shadow-2xs hover:bg-indigo-50/40"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUploadProcess(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-2.5 bg-white rounded-full shadow-sm text-[#6366f1] group-hover:scale-110 transition-transform border border-indigo-100">
                    {isParsingDoc ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 text-xs sm:text-sm flex items-center justify-center gap-1.5">
                      <span>이력서·자기소개서·구직신청서 서류 첨부하기</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">PDF · TXT · DOCX</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      클릭하여 파일을 선택하거나 이 영역으로 파일을 끌어다 놓으세요 (자동 텍스트 추출 후 아래 1번 데이터창에 삽입됩니다)
                    </p>
                  </div>
                </div>

                {parseDocStatus && (
                  <div className={`mt-3 p-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 ${
                    parseDocStatus.type === "success" 
                      ? "bg-emerald-100/80 text-emerald-900 border border-emerald-300/60" 
                      : "bg-rose-100/80 text-rose-900 border border-rose-300/60"
                  }`}>
                    <Paperclip className="w-3.5 h-3.5 shrink-0" />
                    <span>{parseDocStatus.text}</span>
                  </div>
                )}
              </div>

              {/* 1. 구직자 서류 데이터 */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>1. [필수] 구직자 서류 데이터</span>
                  <span className="text-[11px] text-blue-600 font-medium">①학력 ②경력 ③자격 ④조건</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.documentData}
                  onChange={(e) => handleInputChange("documentData", e.target.value)}
                  placeholder="①학력: ...&#10;②경력/활동이력: ...&#10;③보유자격증: ...&#10;④희망직무 및 조건: ..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs leading-relaxed bg-slate-50/80 text-slate-800 transition shadow-inner"
                />
              </div>

              {/* 2. 취업목표 */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  2. [필수] 취업목표 (희망직무 / 기업군 / 최소수용조건)
                </label>
                <textarea
                  rows={2}
                  value={formData.jobGoal}
                  onChange={(e) => handleInputChange("jobGoal", e.target.value)}
                  placeholder="희망직무: 백엔드 개발 / 목표기업군: SI 및 솔루션 / 최소수용조건: 수도권"
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs bg-slate-50/80 text-slate-800 transition shadow-inner"
                />
              </div>

              {/* 3 & 4. 기준연도 & 수행일 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>3. [필수] 기준연도</span>
                  </label>
                  <input
                    type="text"
                    value={formData.baseYear}
                    onChange={(e) => handleInputChange("baseYear", e.target.value)}
                    placeholder="2026"
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs font-bold text-center bg-slate-50/80 text-slate-800 transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>4. [필수] 수행일 (분석시점)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.executionDate}
                    onChange={(e) => handleInputChange("executionDate", e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs font-bold text-center bg-slate-50/80 text-slate-800 transition shadow-inner"
                  />
                </div>
              </div>

              {/* 5. 국취제 참여정보 */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>5. [선택] 국취제 참여정보 &amp; 상담사 관찰</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.participationInfo}
                  onChange={(e) => handleInputChange("participationInfo", e.target.value)}
                  placeholder="Ⅰ/Ⅱ유형 참여, 구직기간, 참여 동기 단서, 애로사항 등 입력"
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs bg-slate-50/80 text-slate-800 transition shadow-inner leading-relaxed"
                />
              </div>

              {/* 6. 출력 모드 선택 */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  6. [선택] 출력 모드 (분할 실행 vs 전체 완주)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: "1", label: "모드1: 진단", sub: "STEP 1~4" },
                    { id: "2", label: "모드2: 전략", sub: "STEP 5~8" },
                    { id: "3", label: "모드3: 실행", sub: "STEP 9~10" },
                    { id: "4", label: "모드4: 일지", sub: "STEP 11" },
                    { id: "ALL", label: "ALL: 전체", sub: "완주 출력" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleInputChange("outputMode", mode.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        formData.outputMode === mode.id
                          ? "bg-slate-900 border-slate-900 text-white font-bold shadow-md ring-2 ring-slate-900/20 scale-[1.02]"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="text-xs font-bold">{mode.label}</span>
                      <span className={`text-[10px] font-mono font-medium ${formData.outputMode === mode.id ? "text-blue-300" : "text-slate-400"}`}>
                        {mode.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Counselor Additional Request outside XML */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block font-bold text-indigo-950 mb-1.5 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-indigo-600" />
                  <span>상담사 추가 요청사항 (태그 외부 지시문 전달)</span>
                </label>
                <input
                  type="text"
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="예: 참여자가 면접 불안이 크니 STEP 10 실행 전략에서 대본 연습 강하게 강조해줘"
                  className="w-full p-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 bg-indigo-50/40 text-xs font-medium placeholder:text-slate-400 transition"
                />
              </div>

              {/* Submit Execution Action */}
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2.5 text-sm disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>전략 엔진 가설 분석 연산 중...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>🎯 취업지원 전략 엔진 분석 실행</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Right / Main Section: Analysis Result Viewer or Guide */}
        <div className={`lg:col-span-7 space-y-6 ${activeTab === "form" ? "hidden lg:block" : ""}`}>
          
          {/* Guide Tab Content */}
          {activeTab === "guide" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">국민취업지원제도 전략 엔진 핵심 설계 가이드</h2>
                  <p className="text-xs text-slate-400 font-normal">전략 엔진의 기본 원칙과 하드 게이트 규격에 대한 공식 매뉴얼</p>
                </div>
              </div>

              <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-700">
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50/30 p-5 rounded-2xl border border-blue-200/80 shadow-xs">
                  <h3 className="font-bold text-blue-950 text-sm mb-1.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    1. 상담사 보조 역할 규정
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-900/90 leading-relaxed">
                    본 엔진은 참여자의 동기나 심리를 단정하는 판단자가 아닙니다. 서류와 행동 관찰 단서에 근거하여 <strong className="text-blue-950 underline decoration-blue-500 decoration-2 font-bold">"서류상 추정 가설"</strong>을 제시하며, 최종 검증과 개입 판단은 담당 상담사님의 권한입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-red-50/60 p-4 rounded-xl border border-red-200/80 transition hover:shadow-sm">
                    <span className="font-bold text-red-800 block mb-1 text-xs flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      하드게이트 G1 (위기우선)
                    </span>
                    <p className="text-[11px] text-red-900/80 leading-relaxed">
                      자·타해, 생계 및 정신건강 위기 신호 감지 시 분석을 중단하고 전문기관 연계(1577-0199 등)를 맨 위에 출력합니다.
                    </p>
                  </div>
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 transition hover:shadow-sm">
                    <span className="font-bold text-amber-800 block mb-1 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      하드게이트 G2 (무결성)
                    </span>
                    <p className="text-[11px] text-amber-900/80 leading-relaxed">
                      형식적 구직활동 위장, 실적 부풀리기, 수급요건 회피 요청을 거부하고 실질 취업 본질로 환기합니다.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 transition hover:shadow-sm">
                    <span className="font-bold text-slate-800 block mb-1 text-xs flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      하드게이트 G3 (범위밖)
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      고용센터 고유 권한 업무(수급자격 인정 결정 등)는 소관 공식 행정 절차로 이관 안내합니다.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-900 mb-2.5 text-sm">프롬프트 강제 제약 조건 준수 현황</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    <li>모든 판정 및 평가에 반드시 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono font-bold border border-slate-200">(근거: 서류 인용/항목)</code>을 표기합니다. 근거가 없을 시 빈칸이나 "확인 필요"로 둡니다.</li>
                    <li>모호한 형용사("잘", "적절히", "충분히") 사용을 금지하며 등급(상/중/하)·수치·기한·행동동사로 대체합니다.</li>
                    <li>미완성 줄임말("...", "이하 생략")을 엄격히 금지합니다.</li>
                    <li>인적사항(성명 이니셜, 나이, 직전직장 등) 임의 날조를 금지하며 서류에 없을 시 "(확인 필요)"로 출력합니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Result Tab Content */}
          {activeTab !== "guide" && (
            <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 min-h-[640px] flex flex-col overflow-hidden">
              
              {/* Result Toolbar Header */}
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                    {loading ? "전략 엔진 가설 연산 수행 중..." : "전략 엔진 분석 리포트 결과"}
                  </span>
                  {!loading && analysisResult && (
                    <span className="bg-blue-600/30 text-blue-300 font-mono text-[11px] px-2.5 py-0.5 rounded-full border border-blue-500/40 font-bold">
                      MODE: {formData.outputMode}
                    </span>
                  )}
                </div>

                {analysisResult && !loading && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-100 text-xs py-2 px-3.5 rounded-xl border border-slate-700 transition font-bold shadow-sm cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">클립보드 복사 완료</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-300" />
                        <span>전체 리포트 복사</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Result Display Area */}
              <div className="p-6 md:p-10 flex-1 overflow-y-auto max-h-[82vh] bg-white">
                
                {/* Loading State */}
                {loading && (
                  <div className="py-24 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin shadow-lg" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-w-md w-full px-4">
                      <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                        국취제 실무 전략 엔진 연산 중...
                      </h3>
                      <div className="text-xs text-slate-600 font-mono space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left shadow-inner">
                        <p className="flex items-center gap-2.5 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>하드 게이트 G1~G3 위기 및 부정수급 필터링</span>
                        </p>
                        <p className="flex items-center gap-2.5 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>사전 처리 규칙 (서류 충족 조건1~4 검증)</span>
                        </p>
                        <p className="flex items-center gap-2.5 text-blue-600 font-bold animate-pulse pt-1 border-t border-slate-200">
                          <ChevronRight className="w-4 h-4 shrink-0" />
                          <span>STEP 판정 반영 및 (근거: 서류 인용) 강제 맵핑 중...</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {!loading && errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-red-950 my-8 text-center max-w-lg mx-auto shadow-sm">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg text-red-900 mb-2">분석 연산 오류 발생</h3>
                    <p className="text-sm text-red-700/90 leading-relaxed">{errorMessage}</p>
                    <button
                      onClick={runAnalysis}
                      className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md cursor-pointer"
                    >
                      다시 시도하기
                    </button>
                  </div>
                )}

                {/* Empty Initial State */}
                {!loading && !analysisResult && !errorMessage && (
                  <div className="py-28 text-center text-slate-400 flex flex-col items-center justify-center space-y-5">
                    <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                      <Layers className="w-14 h-14 text-slate-300" />
                    </div>
                    <div className="max-w-md px-4">
                      <h4 className="font-bold text-slate-800 text-base mb-1.5">분석 리포트 생성 대기 중</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        좌측 입력 폼에서 참여자 서류 데이터와 취업목표를 확인하신 뒤 <strong className="text-blue-600 font-semibold">분석 실행 버튼</strong>을 클릭해 주세요. 상단의 템플릿 프리셋을 선택하시면 즉시 시연이 가능합니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* Render Returned Analysis */}
                {!loading && analysisResult && (
                  <div className="space-y-6">
                    
                    {/* Check if Gate Triggered */}
                    {gateTrigger && (
                      <HardGateWarning 
                        type={gateTrigger as any} 
                        onSelectGoal={(goal) => handleInputChange("jobGoal", goal)}
                      />
                    )}

                    {/* Enhanced Readable Report Output with Custom Premium Markdown Styling */}
                    <div className="max-w-none font-sans text-slate-800 leading-relaxed text-sm sm:text-base">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => (
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-950 border-b-2 border-slate-900 pb-3.5 mb-6 mt-4 tracking-tight flex items-center gap-2.5" {...props} />
                          ),
                          h2: ({node, ...props}) => (
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 bg-slate-100/90 px-4 py-3 rounded-xl border border-slate-200 mt-8 mb-4 shadow-2xs tracking-tight flex items-center gap-2" {...props} />
                          ),
                          h3: ({node, ...props}) => (
                            <h3 className="text-base sm:text-lg font-bold text-blue-950 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-transparent border-l-4 border-blue-600 px-4 py-3 rounded-r-xl shadow-2xs mt-8 mb-4 tracking-tight" {...props} />
                          ),
                          h4: ({node, ...props}) => (
                            <h4 className="text-sm sm:text-base font-bold text-slate-800 mt-6 mb-2 tracking-tight flex items-center gap-1.5 before:content-['•'] before:text-blue-600" {...props} />
                          ),
                          p: ({node, ...props}) => (
                            <p className="text-[14px] sm:text-[15px] text-slate-700 leading-[1.8] my-3 break-keep font-normal" {...props} />
                          ),
                          ul: ({node, ...props}) => (
                            <ul className="list-disc my-4 pl-6 space-y-2 text-[14px] sm:text-[15px] text-slate-700 leading-relaxed marker:text-blue-500" {...props} />
                          ),
                          ol: ({node, ...props}) => (
                            <ol className="list-decimal my-4 pl-6 space-y-2 text-[14px] sm:text-[15px] text-slate-700 leading-relaxed marker:font-bold marker:text-slate-900" {...props} />
                          ),
                          li: ({node, ...props}) => (
                            <li className="pl-1 leading-relaxed" {...props} />
                          ),
                          blockquote: ({node, ...props}) => (
                            <blockquote className="my-5 p-4 sm:p-5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-2xl text-slate-800 text-sm leading-relaxed shadow-2xs border-y border-r border-amber-100/80 font-medium" {...props} />
                          ),
                          table: ({node, ...props}) => (
                            <div className="w-full overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-sm bg-white">
                              <table className="w-full text-left border-collapse" {...props} />
                            </div>
                          ),
                          thead: ({node, ...props}) => (
                            <thead className="bg-slate-100/90 border-b-2 border-slate-200 text-slate-900" {...props} />
                          ),
                          th: ({node, ...props}) => (
                            <th className="p-3 sm:p-3.5 text-xs sm:text-[13px] font-bold tracking-tight text-slate-900 border-r border-slate-200 last:border-r-0 whitespace-nowrap bg-slate-100/90" {...props} />
                          ),
                          td: ({node, ...props}) => (
                            <td className="p-3 sm:p-3.5 text-xs sm:text-[13px] text-slate-700 border-t border-r border-slate-200 last:border-r-0 bg-white leading-relaxed align-top" {...props} />
                          ),
                          strong: ({node, ...props}) => (
                            <strong className="font-bold text-slate-950 bg-amber-100/50 px-1 py-0.5 rounded shadow-2xs border border-amber-200/50 inline-block my-0.5" {...props} />
                          ),
                          code: ({node, inline, className, children, ...props}: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            if (!inline && match) {
                              return (
                                <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 p-4 text-xs font-mono overflow-x-auto shadow-md">
                                  <code className={className} {...props}>{children}</code>
                                </div>
                              );
                            }
                            return (
                              <code className="bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded font-mono text-xs font-bold inline-block mx-0.5" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {analysisResult}
                      </ReactMarkdown>
                    </div>

                    {/* Continuation Notice if Mode is ALL and might be cut */}
                    {formData.outputMode === "ALL" && analysisResult.includes("이어서 출력할 STEP:") && (
                      <div className="mt-10 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-5 rounded-2xl text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <span className="font-bold flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                          <span>길이 한계로 분할 완주 출력되었습니다. 버튼을 눌러 나머지 STEP을 마저 완료하세요.</span>
                        </span>
                        <button
                          onClick={() => {
                            setAdditionalMessage("이전 답변에 명시된 '이어서 출력할 STEP'부터 끝까지 누락 없이 출력해줘.");
                            runAnalysis();
                          }}
                          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md cursor-pointer shrink-0 transition active:scale-95"
                        >
                          👉 이어서 완주 출력 실행
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>
              
              {/* Footer inside viewer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 text-center text-[11px] text-slate-500 font-sans">
                국민취업지원제도 현장 맞춤형 AI 취업지원 엔진 — 본 분석 리포트는 상담 실무 보조용 가설 자료이며 공식 고용행정 판정을 대신하지 않습니다.
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Global Page Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 border-t border-slate-800/80 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">© 2026 국민취업지원제도 현장 실무 전략 엔진 팀. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-mono text-[11px]">
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">[G1 위기 우선 배지]</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">[G2 부정수급 무결성]</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">[G3 소관 이관]</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">[R2 근거 강제 준수]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

