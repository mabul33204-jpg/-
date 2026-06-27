import React, { useState } from "react";
import { 
  ShieldCheck, Target, Cpu, FileCheck, AlertOctagon, ArrowRight, 
  CheckCircle2, Users, Sparkles, Layers, Award, Zap, ShieldAlert,
  HelpCircle, BookOpen, ChevronRight, Check, HeartHandshake, Briefcase,
  Key, Lock, ExternalLink, Loader2
} from "lucide-react";

interface LandingPageProps {
  onEnterWorkspace: (initialTab?: "form" | "result" | "guide") => void;
}

export default function LandingPage({ onEnterWorkspace }: LandingPageProps) {
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem("GEMINI_API_KEY") || "");
  const [isKeyValid, setIsKeyValid] = useState<boolean>(() => !!localStorage.getItem("GEMINI_API_KEY"));
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatusMessage, setVerifyStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleVerifyKey = async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setVerifyStatusMessage({ type: "error", text: "올바른 Google Gemini API 키를 입력해 주세요." });
      return;
    }
    setIsVerifying(true);
    setVerifyStatusMessage(null);
    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: trimmed })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        localStorage.setItem("GEMINI_API_KEY", trimmed);
        setIsKeyValid(true);
        setVerifyStatusMessage({ type: "success", text: "API 키 검증 및 등록이 완료되었습니다. 이제 워크스페이스를 시작할 수 있습니다." });
      } else {
        setIsKeyValid(false);
        setVerifyStatusMessage({ type: "error", text: data.error || "유효하지 않은 API 키입니다. 다시 확인해 주세요." });
      }
    } catch (e) {
      setIsKeyValid(false);
      setVerifyStatusMessage({ type: "error", text: "서버 연결 중 오류가 발생했습니다." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAttemptEnter = (tab: "form" | "guide" = "form") => {
    if (isKeyValid) {
      onEnterWorkspace(tab);
    } else {
      document.getElementById("api-key-registration-section")?.scrollIntoView({ behavior: "smooth" });
      setVerifyStatusMessage({ type: "error", text: "전략 워크스페이스를 사용하려면 먼저 유효한 Gemini API 키를 등록해 주세요." });
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-emerald-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">
      
      {/* Background Organic Glow & Leaf-inspired Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[650px] h-[650px] bg-emerald-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-[25%] right-[-10%] w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[25%] w-[750px] h-[750px] bg-emerald-800/20 rounded-full blur-[160px]" />
        <div className="absolute top-[60%] left-[-5%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#064e3b]/90 border border-emerald-500/30 shadow-2xl mb-8 animate-fade-in backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-emerald-100 tracking-tight">
            공공 고용서비스 디지털 전환 특화 솔루션
          </span>
          <span className="bg-amber-400/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold border border-amber-400/30">
            v1.0 PRO
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.2] mb-6 break-keep drop-shadow-sm">
          국민취업지원제도 상담사를 위한{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
            분석 보조 전략 엔진
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-emerald-200/80 max-w-3xl leading-relaxed mb-10 font-normal break-keep">
          참여자의 내면 동기를 단정하지 않고 서류상 객관적 팩트만 분석합니다.{" "}
          <strong className="text-amber-200 font-semibold underline decoration-amber-400/60 decoration-2 underline-offset-4">서류 기반 추정 가설 원칙</strong>과{" "}
          <strong className="text-amber-200 font-semibold underline decoration-amber-400/60 decoration-2 underline-offset-4">3단계 하드 게이트 안전장치</strong>로 현장 대면 상담의 전문성과 신뢰도를 극대화하세요.
        </p>

        {/* CTA Buttons (Sand Peach Gold & Forest Dark) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16 flex-wrap">
          <button
            onClick={() => {
              document.getElementById("api-key-registration-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black px-8 py-4 rounded-full shadow-xl shadow-indigo-950/40 hover:shadow-2xl hover:shadow-indigo-900/50 transition-all duration-300 text-base flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] border border-indigo-400/40 animate-pulse"
          >
            <Key className="w-5 h-5 text-amber-300 rotate-45" />
            <span className="tracking-tight">API 키 등록하고 시작</span>
          </button>

          <button
            onClick={() => handleAttemptEnter("form")}
            className="w-full sm:w-auto bg-gradient-to-r from-[#ebd5b3] via-[#e2c499] to-[#d8b27f] hover:from-[#f3e3cb] hover:to-[#e2c499] text-[#2c1c0c] font-extrabold px-8 py-4 rounded-[22px] shadow-xl shadow-amber-950/40 hover:shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 text-base flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.98] border border-white/40"
          >
            <Cpu className="w-5 h-5 text-[#5c3d1e] group-hover:rotate-12 transition-transform" />
            <span className="tracking-tight">전략 엔진 워크스페이스 입장</span>
            <ArrowRight className="w-5 h-5 text-[#5c3d1e] group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => handleAttemptEnter("guide")}
            className="w-full sm:w-auto bg-[#064e3b]/80 hover:bg-[#047857]/80 text-emerald-100 border border-emerald-600/50 hover:border-emerald-400/60 font-semibold px-7 py-4 rounded-[22px] shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 text-base flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
          >
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <span className="tracking-tight">엔진 핵심 가이드 매뉴얼</span>
          </button>
        </div>


      </section>

      {/* Core Philosophy / Bento Grid Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase mb-3 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full w-fit mx-auto">Core Engine Philosophy</h2>
          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
            국민취업지원제도 현장에 특화된{" "}
            <span className="underline decoration-amber-400 decoration-4 underline-offset-8">4가지 독보적 강점</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Main Principle */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#064e3b] via-[#064e3b]/90 to-[#022c22] border border-emerald-500/30 rounded-[32px] p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-300/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-amber-400/10 transition-all duration-500" />
            <div>
              <div className="p-3.5 bg-amber-400/15 border border-amber-300/30 rounded-2xl w-fit mb-6 text-amber-300 shadow-inner">
                <Users className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 tracking-wider uppercase">PRINCIPLE 01</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4 tracking-tight">
                참여자의 동기나 심리 단정 금지
              </h3>
              <p className="text-emerald-100/80 leading-relaxed text-sm sm:text-base break-keep">
                AI는 참여자의 동기나 심리를 단정하는 판단자가 아닙니다. 입력된 서류와 상담관찰단서에 근거하여 오직 <strong className="text-[#2c1c0c] bg-gradient-to-r from-[#ebd5b3] to-[#d8b27f] px-2.5 py-0.5 rounded-md font-bold shadow-sm">"서류상 추정 가설"</strong>만을 제시합니다.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-emerald-600/40 flex items-center gap-3 text-xs text-emerald-200/80 font-mono">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>동기 추정 단서 인용 필수 / 주관적 형용사('열정적인' 등) 자동 필터링</span>
            </div>
          </div>

          {/* Bento Card 3: Evidence Mapping */}
          <div className="bg-gradient-to-br from-[#064e3b] to-[#022c22] border border-emerald-500/30 rounded-[32px] p-8 sm:p-10 shadow-2xl flex flex-col justify-between hover:border-emerald-300/40 transition-all duration-300">
            <div>
              <div className="p-3.5 bg-emerald-400/15 border border-emerald-300/30 rounded-2xl w-fit mb-6 text-emerald-300 shadow-inner">
                <FileCheck className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider uppercase">RULE R2</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 mb-4 tracking-tight">
                근거 인용 강제 규격
              </h3>
              <p className="text-emerald-100/80 text-sm leading-relaxed mb-6 break-keep">
                모든 진단과 역량 평가 항목 끝에는 반드시 <code className="text-amber-300 bg-black/40 px-2 py-1 rounded font-mono text-xs border border-amber-400/30 font-bold shadow-inner">(근거: 서류 인용)</code> 좌표를 매핑합니다. 근거 데이터 누락 시 임의로 날조하지 않고 '(확인 필요)'로 표기합니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#022c22] font-mono text-xs text-emerald-200 border border-emerald-800/80 shadow-inner leading-relaxed">
              <span className="text-amber-300 font-bold">✔ 강점</span>: 직무 자격 요건 충족<br/>
              <span className="text-emerald-400/80">└ (근거: 정보처리기사 취득)</span>
            </div>
          </div>

          {/* Bento Card 4: Step Completion */}
          <div className="lg:col-span-3 bg-gradient-to-br from-[#064e3b] via-[#064e3b]/90 to-[#022c22] border border-emerald-500/30 rounded-[32px] p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-teal-300/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
            <div>
              <div className="p-3.5 bg-teal-400/15 border border-teal-300/30 rounded-2xl w-fit mb-6 text-teal-300 shadow-inner">
                <Layers className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-teal-300 tracking-wider uppercase">MODULAR ENGINE</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4 tracking-tight">
                분할 실행 모드 &amp; STEP 1~11 전체 완주
              </h3>
              <p className="text-emerald-100/80 leading-relaxed text-sm sm:text-base break-keep mb-6">
                상담 회기 및 필요 목적에 따라 <strong className="text-amber-200">모드1(진단) · 모드2(전략) · 모드3(역량) · 모드4(서류) · 모드5(실행)</strong>을 선택적으로 연산할 수 있습니다. 전체 완주 모드 실행 시 토큰 한계를 넘는 대용량 분석도 이어보기 체인을 통해 끝까지 누락 없이 출력합니다.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
                {[
                  { m: "모드1", label: "초기 진단", s: "STEP 1~4" },
                  { m: "모드2", label: "방향 전략", s: "STEP 5~8" },
                  { m: "모드3", label: "역량 매칭", s: "STEP 9~10" },
                  { m: "모드4", label: "서류 검증", s: "STEP 11" },
                  { m: "ALL", label: "전체 완주", s: "STEP 1~11" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#022c22]/90 p-3.5 rounded-2xl border border-emerald-800/80 text-center shadow-sm hover:border-amber-300/50 transition-colors">
                    <span className="text-xs font-extrabold text-amber-300 block">{item.m}</span>
                    <span className="text-xs font-medium text-white block my-1">{item.label}</span>
                    <span className="text-[10px] font-mono text-emerald-300/70">{item.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Workflow Comparison Section */}
      <section className="relative z-10 py-20 bg-[#011c16]/60 border-y border-emerald-900/60 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold tracking-widest text-teal-300 uppercase mb-3">Workflow Innovation</h2>
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              왜 기존 범용 AI 대신{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-emerald-300">특화 전략 엔진</span>인가?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Old Way */}
            <div className="bg-[#022c22]/70 border border-rose-500/30 rounded-[32px] p-8 sm:p-9 relative shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-500/15 rounded-2xl text-rose-300 font-bold text-sm border border-rose-500/30 flex items-center gap-2">
                  <span>❌ 기존 챗봇 활용 시</span>
                </div>
              </div>
              <ul className="space-y-4 text-emerald-100/70 text-sm sm:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">•</span>
                  <span>참여자의 심리와 동기를 멋대로 단정하여 주관적 오류 발생</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">•</span>
                  <span>극심한 생계 위기나 자해 신호를 감지하지 못하고 일반 구직 조언 내뱉음</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">•</span>
                  <span>형식적인 구직활동 횟수 채우기용 멘트 생성 등 부정수급 방지 취약</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">•</span>
                  <span>'열정적으로 임함' 등 측정 불가능한 미사여구와 근거 없는 허위 펙트 출력</span>
                </li>
              </ul>
            </div>

            {/* Special Engine Way */}
            <div className="bg-gradient-to-br from-[#064e3b] via-[#047857]/90 to-[#022c22] border-2 border-amber-300/60 rounded-[32px] p-8 sm:p-9 shadow-2xl relative">
              <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-[#ebd5b3] via-[#e2c499] to-[#d8b27f] text-[#2c1c0c] text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg border border-white/40">
                Recommended
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-400/20 rounded-2xl text-amber-200 font-bold text-sm border border-amber-300/40 flex items-center gap-2 shadow-inner">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>국취제 특화 엔진 도입 후</span>
                </div>
              </div>
              <ul className="space-y-4 text-white text-sm sm:text-base leading-relaxed font-medium">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span>서류상 추정 가설 원칙으로 상담사의 현장 검증 권한 완벽 보장</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span>위기 신호(G1) 감지 시 즉시 분석 중단 후 1577-0199 긴급 연계 출력</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span>형식적 구직활동 및 부풀리기 차단(G2) 후 실질 역량 강화로 대화 환기</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span>100% 서류 인용 좌표 표기 규격으로 정량화된 등급 및 행동 전략 제시</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Demo Banner & API Key Registration Final CTA */}
      <section id="api-key-registration-section" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="bg-gradient-to-b from-[#064e3b] via-[#047857]/90 to-[#022c22] rounded-[36px] p-6 sm:p-14 border border-amber-300/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 text-amber-300 text-xs font-mono mb-6 border border-amber-400/30 shadow-inner backdrop-blur-md">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>현장 테스트 시나리오 프리셋 탑재 완료</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
              지금 바로 특화 전략 엔진을 경험해보세요
            </h2>
            <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed break-keep">
              별도의 복잡한 세팅 없이 하드 게이트 필터링과 모드별 전략 분석을 즉시 수행할 수 있습니다. 아래에서 본인의 Gemini API 키를 안전하게 검증하고 워크스페이스를 시작하세요.
            </p>

            {/* User Mandated API Key Registration UI Card (Image 2 Ref) */}
            <div className="bg-white text-slate-800 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 max-w-3xl mx-auto text-left shadow-2xl border border-white/40 mb-10 relative">
              
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-full text-[#6366f1] shadow-sm">
                  <Key className="w-5 h-5 rotate-45" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Gemini API 키 등록</h3>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed break-keep">
                본 진단은 사용자 본인의 Google Gemini API 키로 동작합니다. 키는 <strong className="text-slate-900 font-bold underline decoration-indigo-500 decoration-2">이 브라우저에만</strong> 저장되며 외부로 전송되지 않습니다.
              </p>

              {/* Input Label */}
              <label className="block text-[11px] font-mono font-bold text-slate-700 tracking-wider mb-2 uppercase">API KEY</label>
              
              {/* Input Box */}
              <div className="relative mb-5">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value);
                    if (isKeyValid) setIsKeyValid(false);
                  }}
                  placeholder="AIza... 로 시작하는 키를 붙여넣으세요"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:bg-white font-mono transition-all shadow-inner"
                />
              </div>

              {/* Links & Verify CTA Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-slate-800 underline underline-offset-4 hover:text-[#6366f1] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Google AI Studio에서 키 발급받기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleVerifyKey}
                  disabled={isVerifying || !apiKeyInput.trim()}
                  className="w-full sm:w-auto bg-[#a5b4fc] hover:bg-[#818cf8] text-slate-950 font-extrabold px-6 py-3 rounded-full shadow hover:shadow-md transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                      <span>검증 중...</span>
                    </>
                  ) : (
                    <span>키 검증 후 등록</span>
                  )}
                </button>
              </div>

              {/* Status Message Display */}
              {verifyStatusMessage && (
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm mb-5 font-semibold flex items-center gap-2.5 animate-fade-in ${
                  verifyStatusMessage.type === "success" 
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200" 
                    : "bg-rose-50 text-rose-900 border border-rose-200"
                }`}>
                  {verifyStatusMessage.type === "success" 
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 
                    : <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{verifyStatusMessage.text}</span>
                </div>
              )}

              {/* Footer Notice inside Card */}
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4 mt-2 break-keep">
                키는 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono font-medium">localStorage</code> 에만 저장되며, 진단 요청은 브라우저에서 직접 Google Gemini API로 전송됩니다. 다른 사람의 키를 무단으로 사용하지 마세요.
              </p>
            </div>

            {/* Conditional Main Start Button Below Card */}
            <div className="flex justify-center">
              {isKeyValid ? (
                <button
                  onClick={() => onEnterWorkspace("form")}
                  className="bg-gradient-to-r from-[#ebd5b3] via-[#e2c499] to-[#d8b27f] hover:from-[#f3e3cb] hover:to-[#e2c499] text-[#2c1c0c] font-black px-10 py-5 rounded-[24px] shadow-2xl hover:scale-105 transition-all duration-300 text-base sm:text-lg inline-flex items-center gap-3 cursor-pointer group active:scale-100 border border-white/50 animate-bounce"
                >
                  <span>✨ 전략 워크스페이스 시작하기</span>
                  <ArrowRight className="w-5 h-5 text-[#5c3d1e] group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    document.querySelector("input[type='password']")?.focus();
                  }}
                  className="bg-[#c7d2fe] hover:bg-[#a5b4fc] text-slate-800 font-extrabold px-10 py-5 rounded-[24px] shadow-xl transition-all duration-300 text-base sm:text-lg inline-flex items-center gap-2.5 cursor-pointer border border-[#818cf8]/40"
                >
                  <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>키 등록 후 시작할 수 있어요</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-emerald-900/50 text-xs text-emerald-200/60 text-center bg-[#011c16]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-emerald-200">
            <Briefcase className="w-4 h-4 text-amber-300" />
            <span>국민취업지원제도 현장 실무 전략 엔진</span>
          </div>
          <p>© 2026 국민취업지원제도 실무 특화 전략 엔진 팀. All rights reserved.</p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-amber-200/70">
            <span>[G1~G3 Gate]</span>
            <span>[Rule R2]</span>
            <span>[XML Isolation]</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
