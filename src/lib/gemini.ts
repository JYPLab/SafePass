import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export const getGeminiModel = (model: string = "gemini-1.5-pro") => {
    return genAI.getGenerativeModel({ model });
};

export const regulatoryPromptTemplate = (productName: string, targetCountry: string, intendedUse: string, ingredients: string) => `
시스템: 당신은 글로벌 수출 규제 전문가(SPS/TBT 전문)입니다.
대상 제품: ${productName}
대상 국가: ${targetCountry}
사용 목적: ${intendedUse}
성분 리스트: ${ingredients}

다음 지침에 따라 분석 리포트를 JSON 형식으로 작성하세요:
1. 해당 국가의 보건 당국 기준에 따른 품목 분류를 예측하세요.
2. 현지 RP(Responsible Person/현지 책임자) 선임 필요 여부를 도출하세요.
3. 통관 거부 리스크가 있는 규제 요소를 식별하세요.

응답 형식 (JSON):
{
  "classification": "예측된 품목 분류 (예: 고위험 의료기기, 일반 식품 등)",
  "rp_required": boolean,
  "rp_details": "RP 관련 상세 설명",
  "compliance_risks": [
    {
      "module": "Compliance_Analysis",
      "severity": "HIGH/MEDIUM/LOW",
      "description": "규제 위반 가능성 및 사유"
    }
  ]
}
`;
