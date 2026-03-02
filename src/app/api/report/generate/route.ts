import { NextResponse } from 'next/server';

/**
 * 통합 진단 결과 생성 API
 * Endpoint: /api/report/generate
 * Logic: BOM 분석과 Compliance(LLM) 분석을 통합하여 최종 신호등 지표 도출.
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product_name, target_country, intended_use, ingredients } = body;

        // Use absolute URLs for internal calls in Next.js API routes
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

        // 1. BOM Analysis Search
        const bomResponse = await fetch(`${baseUrl}/api/analyze/bom`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients, target_country }),
        });
        const bomResult = await bomResponse.json();

        // 2. Compliance LLM Analysis
        const complianceResponse = await fetch(`${baseUrl}/api/analyze/compliance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_name, target_country, intended_use, ingredients }),
        });
        const complianceResult = await complianceResponse.json();

        // 3. Aggregate Risk Factors
        const riskFactors = [
            ...(bomResult.risks || []),
            ...(complianceResult.compliance_risks || []),
        ];

        // 4. Determine Overall Status (Traffic Light)
        // CRITICAL/HIGH -> FAIL (RED)
        // MEDIUM -> CAUTION (YELLOW)
        // LOW/NONE -> PASS (GREEN)

        let status = 'PASS';
        const hasCritical = riskFactors.some(rf => rf.severity === 'CRITICAL' || rf.severity === 'HIGH');
        const hasMedium = riskFactors.some(rf => rf.severity === 'MEDIUM');

        if (hasCritical) {
            status = 'FAIL';
        } else if (hasMedium) {
            status = 'CAUTION';
        }

        const report = {
            analysis_id: `req_${Math.random().toString(36).substr(2, 9)}`,
            product_meta: {
                product_name,
                target_country,
                intended_use,
            },
            engine_result: {
                status,
                classification: complianceResult.classification,
                rp_required: complianceResult.rp_required,
                risk_factors: riskFactors,
            },
        };

        return NextResponse.json(report);
    } catch (error) {
        console.error("Report Generation Error:", error);
        return NextResponse.json(
            { error: 'Failed to generate report', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
