import { PhoneCall, AlertTriangle, ShieldAlert } from "lucide-react";

export default function CrisisBanner() {
  return (
    <div className="bg-gradient-to-r from-red-950 via-rose-950 to-red-900 border-b border-red-800/80 px-4 py-2.5 text-white shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 font-normal tracking-tight">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide shrink-0">
            하드게이트 G1
          </span>
          <span className="text-slate-200">
            <strong className="text-white font-semibold">위기 우선 안내:</strong> 참여자 상담 맥락에서 자·타해 또는 생계/정신 위기 신호 감지 시 엔진 분석을 즉시 중단하고 전문기관 연계를 우선시합니다.
          </span>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 bg-black/30 px-3 py-1 rounded-lg border border-white/10 text-xs">
          <span className="flex items-center gap-1.5 text-rose-300 font-semibold tracking-wide">
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" /> 정신건강위기상담: <span className="text-white underline decoration-rose-400 decoration-2 underline-offset-2">1577-0199</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> 자살예방상담: <span className="text-white underline decoration-amber-400 decoration-2 underline-offset-2">109</span>
          </span>
        </div>
      </div>
    </div>
  );
}

