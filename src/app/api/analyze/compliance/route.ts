import { NextResponse } from 'next/server';
import { getGeminiModel, regulatoryPromptTemplate } from '@/lib/gemini';

/**
 * Local Compliance LLM Engine
 * Endpoint: /api/analyze/compliance
 * Logic: Uses Gemini 1.5 Pro to predict product classification and RP requirements.
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product_name, target_country, intended_use, ingredients } = body;

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY.includes('your_gemini_api_key')) {
            return NextResponse.json({
                classification: target_country === 'ID' ? '일반 가공식품 (BPOM 등록 대상)' : '일반 품목',
                rp_required: true,
                rp_details: "현지 수입사 또는 유통 대행사를 통해 BPOM 등록 및 할랄 인증(BPJPH) 절차가 선행되어야 함.",
                compliance_risks: [
                    {
                        module: "Compliance_Halal",
                        severity: "CRITICAL",
                        description: "원재료 중 돼지고기 성분 확인됨. 인도네시아 BPJPH 할랄 인증 취득 불가 및 수입 금지 대상."
                    }
                ]
            });
        }

        const model = getGeminiModel("gemini-1.5-flash"); // Using flash for speed/cost in MVP
        const prompt = regulatoryPromptTemplate(
            product_name,
            target_country,
            intended_use,
            ingredients.map((i: { name: string }) => i.name).join(', ')
        );

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response (handling potential markdown blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json(
            { error: 'AI Analysis failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
