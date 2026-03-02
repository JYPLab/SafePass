import { NextResponse } from 'next/server';

/**
 * BOM & Process Analyzer API
 * Endpoint: /api/analyze/bom
 * Logic: Filters prohibited ingredients and flags SPS (Sanitary and Phytosanitary) risks
 * based on origin.
 */

interface Ingredient {
  name: string;
  origin: string;
  percentage: number;
}

interface BOMRequest {
  ingredients: Ingredient[];
  target_country: string;
}

// Mock Regulatory Database
const PROHIBITED_SUBSTANCES: Record<string, string[]> = {
  ID: ['pork', 'lard', 'gelatin_pork', 'alcohol_high'], // Indonesia
  TH: ['cannabis_exceed_limit', 'certain_food_colorants'], // Thailand
  US: ['unapproved_dyes', 'raw_milk_soft_cheese'], // USA
};

// Halal (Haram) specific ingredients for ID/MY
const HARAM_INGREDIENTS = ['pork', 'lard', 'blood', 'carmine', 'alcohol'];

// Mock SPS/Quarantine Origin Risks (Country to Country)
const SPS_ORIGIN_RESTRICTIONS: Record<string, Record<string, string>> = {
  ID: {
    ES: '스페인산 원료(선지/육류) 반입 제한 조치 확인.',
    CN: '중국산 가금류 원료 검역 수입 금지 대상.',
  },
  TH: {
    KR: '한국산 신선 딸기 검역 프로토콜 준수 필요.',
  },
};

export async function POST(req: Request) {
  try {
    const body: BOMRequest = await req.json();
    const { ingredients, target_country } = body;

    const risks: Array<{ module: string, severity: string, description: string }> = [];
    const prohibited = PROHIBITED_SUBSTANCES[target_country] || [];
    const originRestrictions = SPS_ORIGIN_RESTRICTIONS[target_country] || {};

    ingredients.forEach((ing) => {
      const ingNameLower = ing.name.toLowerCase();

      // 1. Prohibited Substance Check
      const isProhibited = prohibited.some((p) => ingNameLower.includes(p.toLowerCase()));
      if (isProhibited) {
        risks.push({
          module: 'BOM_Prohibited',
          severity: 'CRITICAL',
          description: `입력하신 '${ing.name}' 성분은 ${target_country} 내 수입/사용 금지 성분입니다.`,
        });
      }

      // 2. Halal Risk Check (specifically for ID)
      if (target_country === 'ID') {
        const isHaram = HARAM_INGREDIENTS.some((h) => ingNameLower.includes(h));
        if (isHaram) {
          risks.push({
            module: 'Compliance_Halal',
            severity: 'CRITICAL',
            description: `'${ing.name}' 성분은 이슬람 율법상 하람(Haram)으로 분류될 가능성이 높습니다. BPJPH 할랄 인증 불가 사유가 됩니다.`,
          });
        }
      }

      // 2. SPS Origin Risk Check
      if (originRestrictions[ing.origin]) {
        risks.push({
          module: 'SPS_Origin',
          severity: 'HIGH',
          description: `${originRestrictions[ing.origin]} (재료: ${ing.name})`,
        });
      }
    });

    return NextResponse.json({
      status: risks.length > 0 ? 'FAIL' : 'PASS',
      risks,
    });
  } catch (error) {
    console.error("BOM Analysis Error:", error);
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
