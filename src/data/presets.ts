import { PresetItem } from "../types";

export const SAMPLE_PRESETS: PresetItem[] = [
  {
    id: "tech-youth",
    title: "이공계 개발직 청년 (유형C / 취업중심형)",
    badge: "정상 진행 (STEP 1~11)",
    description: "컴퓨터공학 전공, 정보처리기사 보유. 목표가 뚜렷하며 직무 역량이 갖춰진 청년 참여자",
    data: {
      documentData: "①학력: 지방 4년제 컴퓨터공학과 졸업 (학점 3.6/4.5)\n②경력/활동이력: 대학 캡스톤 디자인 우수상(웹 쇼핑몰 구축), IT 부트캠프 6개월 수료(Java Backend)\n③보유자격증: 정보처리기사, SQLD, 토익 780점\n④희망직무 및 조건: 백엔드 개발자, 판교/서울 지역, 연봉 3200만원 이상",
      jobGoal: "희망직무: 백엔드 개발자 / 목표기업군: 중견기업 또는 솔루션 SI 전문기업 / 최소수용조건: 수도권 출퇴근 가능 지역, 정규직",
      baseYear: "2026",
      executionDate: new Date().toISOString().split("T")[0],
      participationInfo: "국취제 Ⅰ유형 참여 중. 대면 상담 시 구직 동기가 매우 높고 부트캠프 포트폴리오 정리가 잘 되어 있음.",
      outputMode: "ALL"
    }
  },
  {
    id: "admin-allowance",
    title: "비이공계 행정직 지망 (유형A / 수당중심형 의심)",
    badge: "하드룰 G2 환기 / 전략 축적",
    description: "인문계 졸업 후 장기 미취업. 구체적 역량 없이 수당 수령 요건만 충족하려는 소극적 태도 관찰",
    data: {
      documentData: "①학력: 수도권 4년제 사학과 졸업\n②경력/활동이력: 편의점 아르바이트 1년, 카페 아르바이트 6개월\n③보유자격증: 운전면허 2종 보통\n④희망직무 및 조건: 사무보조 혹은 총무, 집에서 도보 20분 거리, 야근 절대 없음",
      jobGoal: "희망직무: 사무직 / 목표기업군: 집 근처 중소기업 / 최소수용조건: 최저시급 이상, 업무 강도 낮을 것",
      baseYear: "2026",
      executionDate: new Date().toISOString().split("T")[0],
      participationInfo: "국취제 Ⅰ유형 참여. 상담 시 '입사지원 횟수만 채우면 구직촉진수당 나오는 거 맞죠?'라는 질문을 반복함. 형식적 입사지원 징후 보임.",
      outputMode: "ALL"
    }
  },
  {
    id: "career-break",
    title: "경력단절 여성 회계직 (유형B / 혼합형)",
    badge: "비이공계 맞춤 설계",
    description: "출산 후 5년 경력단절. 과거 전산세무 이력 존재하나 자신감 부족으로 진로 잠재적 설정 상태",
    data: {
      documentData: "①학력: 전문대 세무회계과 졸업\n②경력/활동이력: 중소기업 제조업 총무팀 회계담당 실무 경력 3년 (5년 전 퇴사)\n③보유자격증: 전산회계 1급, 전산세무 2급 (유효기간 및 실무 감각 둔화)\n④희망직무 및 조건: 회계/경리 사무직, 09시~18시 근무시간 준수",
      jobGoal: "희망직무: 일반 기업체 회계 및 경리담당 / 목표기업군: 인근 중소기업 / 최소수용조건: 육아 병행 가능한 정시 퇴근 환경",
      baseYear: "2026",
      executionDate: new Date().toISOString().split("T")[0],
      participationInfo: "국취제 Ⅱ유형 참여. 다시 일하고 싶은 욕구는 분명하나 최근 회계프로그램(더존 등) 변화에 대한 두려움 호소.",
      outputMode: "ALL"
    }
  },
  {
    id: "missing-data",
    title: "서류 불완전 케이스 (사전처리 조건1 테스트)",
    badge: "조건 1 감지 및 중단",
    description: "학력 및 자격증 정보 누락. 엔진이 자동 감지하여 추가 정보 4항목 요청 후 중단하는 규격 테스트",
    data: {
      documentData: "이름 홍길동. 그냥 사무직 일자리 알아봐주세요. 자격증은 나중에 딸 생각입니다.",
      jobGoal: "사무직",
      baseYear: "2026",
      executionDate: new Date().toISOString().split("T")[0],
      participationInfo: "국취제 Ⅱ유형",
      outputMode: "1"
    }
  }
];
