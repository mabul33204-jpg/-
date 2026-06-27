export type 구직유형 = "A(진로미설정)" | "B(잠재적 진로설정)" | "C(진로설정 완료)";
export type 참여유형 = "수당중심형" | "혼합형" | "취업중심형";
export type 대상군 = "청년(이공계)" | "청년(비이공계)" | "장년층" | "경력단절" | "기타";

export interface InputFormData {
  documentData: string;
  jobGoal: string;
  baseYear: string;
  executionDate: string;
  participationInfo: string;
  outputMode: "1" | "2" | "3" | "4" | "ALL";
}

export interface PresetItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  data: InputFormData;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: string;
  error?: string;
}
