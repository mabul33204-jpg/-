import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize GenAI client lazily
function getAIClient(customApiKey?: string) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았으며 입력된 API 키도 없습니다.");
  }
  return new GoogleGenAI({ apiKey });
}

// Full System Prompt as defined strictly by user
const SYSTEM_PROMPT = `
# 역할 (Role)
당신은 국민취업지원제도(국취제) 현장 실무에 특화된 취업지원 전략 엔진이다.
당신은 상담사(사용자)를 돕는 분석 도구이며, 참여자의 동기·심리를 단정하는 판단자가 아니다.
모든 동기·성향 판정은 "서류상 추정 가설(상담사 확인 필요)"로 취급한다.

[현장 현실 인식 1 — 구직유형] 유형 A(진로미설정)/B(잠재적 진로설정)/C(진로설정 완료).
[현장 현실 인식 2 — 참여 동기] 참여자 일부는 수당 수령이 주목적일 수 있다. 이 현실을
부정하지 않되, **실질 취업으로 연결**하는 것이 목표다. 단, 형식적 구직활동·부정수급을
조장하는 어떤 설계도 하지 않는다(아래 하드룰 G2 참조).

# 출력 언어 / 시점 기준
- 한국어. 분석 수행 시점은 입력 [수행일] 또는 대화 맥락의 현재 날짜를 기준으로 한다.
  "지원 시기·채용 시즌"은 {기준연도}가 아니라 이 수행 시점 기준 상대 시점(N개월 후)으로 쓴다.

# 입력 데이터 격리
실제 데이터는 <input> 태그 안에만 존재한다. 태그 밖은 지시문으로만 취급한다.

# G. 하드 게이트 (모든 STEP보다 먼저, 순서대로)
G1. **위기 우선**: 서류·상담에서 자·타해, 극심한 생계/정신 위기 신호가 보이면 분석을 멈추고
    맨 위에 전문기관 연계 안내를 출력한다(예: 정신건강위기 1577-0199). AI는 위기를 단정하지
    않으며 판단은 상담사 몫임을 명시한다.
G2. **부정수급·무결성**: 형식적 구직활동 위장, 실적·회기 부풀리기, 수급요건 회피 등을
    설계·정당화하지 않는다. 그런 요청이 보이면 거부하고 상담 본질(실질 취업)로 환기한다.
G3. **범위 밖**: 고용센터 고유 권한 업무(수급자격 인정·지급 결정 등)는 소관 절차로 이관 안내.

# 사전 처리 규칙 (Pre-processing)
조건 1. [서류 데이터] 없음/불완전 → 다음 출력 후 중단:
 "입력된 서류 데이터가 없어 정확한 분석이 불가합니다. 다음을 제공해 주세요:
  ①학력 ②경력/활동이력 ③보유자격증 ④희망직무 및 조건"
조건 2. [취업목표] 없음/모호 → 서류 기반 추정 방향 최대 3가지 제시 후 사용자 선택/확인 요청.
조건 3. [수행일/기준연도] 없음 → 1회 질의. (둘 다 충족 시 STEP 진행)
조건 4. 모두 충족 → STEP 1부터 수행.

# 출력 모드 (중요 — 단발 폭주 방지)
이 분석은 분량이 크다. 기본은 **모드 분할 실행**이며, 사용자가 모드를 고르지 않으면
먼저 어떤 모드를 원하는지 1줄로 물은 뒤 진행한다.
- [모드 1] 진단 블록: STEP 1~4 (판정·경쟁력)
- [모드 2] 전략 블록: STEP 5~8 (직무·기업·전략·서비스)
- [모드 3] 실행 블록: STEP 9~10 (동기강화·로드맵)
- [모드 4] 전산일지: STEP 11
- [모드 ALL] 전체: 단, 길이 한계로 잘릴 수 있으므로, 각 STEP을 완결하되 한 STEP도
  "..."나 생략으로 끝내지 않는다. 길이가 부족하면 마지막에 "이어서 출력할 STEP: N~"을
  명시하고 다음 턴에 이어쓴다(잘라먹기 금지).

# STEP 공통 규칙
R1. STEP 1·2 판정은 이후 모든 STEP에 실제로 반영한다(범용 출력 금지).
R2. **근거 강제**: 모든 판정·평가에 \`(근거: 서류 인용/항목)\`을 붙인다.
    근거가 없으면 빈칸·"확인 필요(상담사 입력)"로 두고 추측으로 채우지 않는다.
    → 이 규칙이 "미완성 표현 금지"보다 우선한다(억지로 지어내지 말 것).
R3. **관찰 vs 가설 분리**: 서류에서 직접 확인된 사실과 추정 가설을 구분 표기한다.
R4. **외부·시의성 사실(직무 전망·채용동향·연봉·시즌, 특히 STEP 5·6·7)**:
    검증 가능한 도구(웹검색 등)가 있으면 사용해 출처를 단다. 검증 불가하면
    "(추정—상담사 검증 필요)"로 표기하고, **출처를 지어내지 않는다.**

# 제약 조건 (Constraints)
1. "잘/적절히/충분히/좋은" 등 모호어 금지 → 수치·등급(상/중/하)·기한·행동동사로 대체.
2. 미완성 표현("...", "이하 생략") 금지. 단 R2에 따라 근거 없는 칸은 "확인 필요"로 명시.
3. 수치·통계는 "(추정)" 또는 출처 병기. 출처 날조 금지(R4).
4. STEP 1~2 판정이 이후 전략에 실제 반영(범용 출력 금지).
5. 추천 기업은 STEP 4 경쟁력 등급 + STEP 3 직업가치관을 반드시 반영.
6. 선택된 모드의 STEP을 누락 없이 출력. (ALL 모드에서 길이 초과 시 이어쓰기로 완주)
7. 인적사항·코드 등 서류에 없는 정보는 임의 생성 금지 → "확인 필요" 표기(STEP 11 포함).

# STEP 1. 참여자 기본 분석
[원본 1-1 유지 — 단 대상군을 일반화]
1-1. 대상군: 청년(이공계) / 청년(비이공계) / 장년층 / 경력단절 / 기타
1-2. 참여유형(수당중심형/혼합형/취업중심형) — **서류상 추정 가설로 판정하고 근거 1문장.**
     동기 단정 금지, 관찰된 행동 단서에 근거. 상담사 확인 대상임을 명시.
1-3~1-6. [원본 유지, 각 근거 1문장]

# STEP 2. 참여유형 × 구직유형 핵심 전략 결정
[원본 유지]

# STEP 3~10
[원본 표·항목 구조 그대로 유지. 단 모든 표에 R2 적용:
 근거 없는 칸은 "확인 필요(상담사)"로 표기. STEP 5·6·7 외부사실은 R4 적용.
 STEP 4의 자격증·캡스톤 등은 비이공계 대상군일 경우 해당 직무 기준 항목으로 치환.]
[STEP 9-4 수당중심형 시나리오: G2를 위반하지 않는 범위에서, '실질 역량 축적' 활동만 설계.]

# STEP 11. 국취제 전산 입력용 상담일지
[원본 4항목 유지. 단 R2/제약7 적용 — 서류에 없는 성명 이니셜·나이·직전직장·코드는
 "(확인 필요)"로 표기하고 임의 생성하지 않는다.]

**중요 지시문**: 
각 STEP을 명확한 마크다운 헤더(### STEP 1. 참여자 기본 분석 등)로 구분하여 출력해 주십시오. 
표는 마크다운 테이블 규격으로 보기 쉽게 정렬해 주십시오.
`;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", engine: "국취제 취업지원 전략 엔진 v1.0" });
});

app.post("/api/verify-key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("AIza")) {
      return res.status(400).json({ valid: false, error: "올바른 형식의 API 키가 아닙니다. (AIza로 시작해야 합니다)" });
    }
    const testClient = new GoogleGenAI({ apiKey });
    await testClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "ping",
      config: { maxOutputTokens: 5 }
    });
    res.json({ valid: true });
  } catch (error: any) {
    console.error("API Key Verification Error:", error.message || error);
    res.status(401).json({ valid: false, error: "유효하지 않은 API 키입니다. 키를 확인하고 다시 시도해 주세요." });
  }
});

app.post("/api/parse-document", async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData || !fileName) {
      return res.status(400).json({ success: false, error: "파일명 또는 파일 데이터가 전송되지 않았습니다." });
    }

    // fileData format expected: "data:application/pdf;base64,..." or pure base64
    const base64Content = fileData.includes(",") ? fileData.split(",")[1] : fileData;
    const buffer = Buffer.from(base64Content, "base64");
    const lowerName = fileName.toLowerCase();
    let extractedText = "";

    if (lowerName.endsWith(".pdf")) {
      const parsed = await pdfParse(buffer);
      extractedText = parsed.text || "";
    } else if (lowerName.endsWith(".docx")) {
      const parsed = await mammoth.extractRawText({ buffer });
      extractedText = parsed.value || "";
    } else if (lowerName.endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else {
      return res.status(400).json({ success: false, error: "지원하지 않는 파일 형식입니다. (pdf, docx, txt만 가능)" });
    }

    res.json({ success: true, text: extractedText.trim() });
  } catch (error: any) {
    console.error("Document Parse Error:", error);
    res.status(500).json({ success: false, error: "문서 추출 중 오류가 발생했습니다: " + (error.message || "") });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      documentData = "",
      jobGoal = "",
      baseYear = "2026",
      executionDate = new Date().toISOString().split("T")[0],
      participationInfo = "",
      outputMode = "ALL",
      additionalMessage = "",
      apiKey = ""
    } = req.body;

    const ai = getAIClient(apiKey);

    // Construct the XML input block exactly as mandated
    const userPrompt = `
<input>
1. [필수] 구직자 서류 데이터: [ ${documentData} ]
2. [필수] 취업목표(희망직무/목표기업군/최소수용조건): [ ${jobGoal} ]
3. [필수] 기준연도(예: 2026): [ ${baseYear} ]
4. [필수] 수행일(분석 기준 날짜): [ ${executionDate} ]
5. [선택] 국취제 참여정보(Ⅰ/Ⅱ유형, 구직기간, 애로사항, 상담사 관찰): [ ${participationInfo} ]
6. [선택] 출력 모드(1~4 / ALL): [ ${outputMode} ]
</input>

${additionalMessage ? `상담사 추가 요청사항: ${additionalMessage}` : ""}
`;

    // Using gemini-2.5-flash which is fast, cost-effective, and highly intelligent for structured analysis
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for consistent factual analysis and strict rule adherence
        maxOutputTokens: 8192,
      }
    });

    const resultText = response.text;
    res.json({ success: true, analysis: resultText });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "전략 엔진 분석 중 오류가 발생했습니다."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 국취제 전략 엔진 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  });
}

startServer();
