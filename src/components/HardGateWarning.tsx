import { ShieldAlert, AlertOctagon, HelpCircle, FileWarning } from "lucide-react";

interface HardGateWarningProps {
  type: "CRISIS_G1" | "FRAUD_G2" | "OUT_OF_SCOPE_G3" | "MISSING_DATA_COND1" | "AMBIGUOUS_COND2";
  message?: string;
  onSelectGoal?: (goal: string) => void;
}

export default function HardGateWarning({ type, message, onSelectGoal }: HardGateWarningProps) {
  if (type === "CRISIS_G1") {
    return (
      <div className="bg-gradient-to-br from-red-50 via-rose-50 to-white border border-red-300 rounded-2xl p-6 my-5 text-red-950 shadow-md ring-4 ring-red-500/10">
        <div className="flex items-center gap-3 font-bold text-base md:text-lg border-b border-red-200/80 pb-3.5 mb-4 text-red-700">
          <div className="p-2 bg-red-100 rounded-xl text-red-600 shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <span className="tracking-tight">[하드 게이트 G1 발동] 긴급 위기 신호 감지 — 분석 중단 및 전문기관 연계 우선</span>
        </div>
        <p className="text-sm leading-relaxed font-normal mb-5 text-slate-800">
          참여자의 서류 데이터 또는 상담 기록에서 <strong className="underline text-red-700 font-semibold decoration-red-400 decoration-2">자해·타해 위험, 극심한 정신적 위기 혹은 임박한 생계 붕괴 신호</strong>가 포착되었습니다. 본 취업지원 전략 엔진은 분석을 중단하며, 아래 전문기관으로의 긴급 연계를 상담사님께 권고합니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-white p-4 rounded-xl border border-red-100 shadow-xs">
          <div className="flex items-center justify-between p-2.5 bg-red-50/50 rounded-lg border border-red-100 text-red-800">
            <span className="font-semibold text-xs">🚨 정신건강위기상담전화</span>
            <span className="text-sm font-bold bg-white px-2.5 py-1 rounded-md shadow-2xs border border-red-200 text-red-700">1577-0199</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-red-50/50 rounded-lg border border-red-100 text-red-800">
            <span className="font-semibold text-xs">☎️ 보건복지상담센터(생계)</span>
            <span className="text-sm font-bold bg-white px-2.5 py-1 rounded-md shadow-2xs border border-red-200 text-red-700">129</span>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-red-600/90 font-medium">
          ※ AI는 위기를 단정하지 않으며, 최종 확인 및 개입 판단은 현장 담당 상담사님의 권한입니다.
        </p>
      </div>
    );
  }

  if (type === "FRAUD_G2") {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 my-5 text-amber-950 shadow-sm">
        <div className="flex items-center gap-2.5 font-bold text-base text-amber-900 mb-2">
          <div className="p-1.5 bg-amber-200/60 rounded-lg text-amber-800">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <span>[하드 게이트 G2] 부정수급 및 형식적 구직활동 조장 방지</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 pl-9">
          형식적 구직활동 위장, 실적·회기 부풀리기, 수급요건 회피 등은 설계하거나 정당화하지 않습니다. 상담 본질인 <strong className="text-amber-950 underline decoration-amber-500 underline-offset-4">'실질 취업 역량 강화 및 매칭'</strong>으로 대화 맥락을 환기합니다.
        </p>
      </div>
    );
  }

  if (type === "MISSING_DATA_COND1") {
    return (
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-6 my-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
        <div className="flex items-center gap-3 text-amber-400 font-bold text-base mb-4">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <FileWarning className="w-5 h-5" />
          </div>
          <span className="tracking-tight">[사전 처리 규칙 조건 1] 서류 데이터 불완전 감지</span>
        </div>
        <div className="bg-slate-800/80 p-5 rounded-xl text-xs sm:text-sm leading-relaxed space-y-3 border border-slate-700/80">
          <p className="text-amber-200 font-semibold tracking-wide">"입력된 서류 데이터가 없어 정확한 분석이 불가합니다. 다음을 제공해 주세요:"</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs flex items-center justify-center font-bold">1</span>
              <span><strong className="text-white">학력</strong> : 최종 학력 및 전공</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
              <span><strong className="text-white">경력/활동</strong> : 경력 및 활동이력</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
              <span><strong className="text-white">자격증</strong> : 보유자격 및 어학</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-xs flex items-center justify-center font-bold">4</span>
              <span><strong className="text-white">목표/조건</strong> : 희망직무 및 조건</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "AMBIGUOUS_COND2") {
    return (
      <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white border border-blue-200 rounded-2xl p-6 my-5 text-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5 font-bold text-base text-blue-900 mb-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span>[사전 처리 규칙 조건 2] 취업목표 모호 감지 — 서류 기반 방향 추천</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mb-4 pl-1">희망 직무가 명확하지 않아 서류 데이터를 기반으로 3가지 가설 방향을 추출했습니다. 하나를 선택해 적용해 주세요:</p>
        <div className="flex flex-wrap gap-2.5">
          {["사무/일반행정 보조 방향", "서비스 및 매장관리 실무 방향", "해당 전공 활용 신입 인턴 방향"].map((goal, idx) => (
            <button
              key={idx}
              onClick={() => onSelectGoal && onSelectGoal(goal)}
              className="bg-white hover:bg-blue-600 hover:text-white text-blue-900 border border-blue-200/80 hover:border-blue-600 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-md flex items-center gap-2 cursor-pointer group"
            >
              <span className="w-5 h-5 rounded-md bg-blue-50 group-hover:bg-blue-500 group-hover:text-white text-blue-600 flex items-center justify-center text-[11px] font-bold">추천{idx+1}</span>
              <span>{goal}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

