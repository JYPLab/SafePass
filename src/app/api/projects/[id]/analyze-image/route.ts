import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const projectId = id;
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const isMockDB = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase_url');
        let targetMarket = 'us';

        // 1. Fetch project details (target_market)
        if (!isMockDB) {
            const { data: project, error: projErr } = await supabase
                .from('projects')
                .select('target_market, category')
                .eq('id', projectId)
                .single();

            if (projErr || !project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            }
            targetMarket = project.target_market;
        }

        // 2. Convert file to generative part
        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const mimeType = file.type;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType
            },
        };

        // 3. Call Gemini Vision API to extract INCI ingredients
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
      Analyze this image of a cosmetic/food product label. 
      Extract all ingredients exactly as written, but normalize them to their standard INCI (International Nomenclature of Cosmetic Ingredients) names where possible.
      Return the result ONLY as a raw JSON array of strings. Do not include markdown formatting or backticks.
      Example: ["Aqua", "Glycerin", "Sodium Hyaluronate"]
    `;

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        // Parse the extracted JSON array
        let extractedIngredients: string[] = [];
        try {
            // Clean formatting if Gemini adds backticks
            const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            extractedIngredients = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse Gemini output:", responseText);
            throw new Error("Failed to extract ingredients correctly");
        }

        // 4. Cross-check against regulation_db
        let rules: any[] = [];

        if (!isMockDB) {
            const { data } = await supabase
                .from('regulation_db')
                .select('*')
                .eq('market', targetMarket);
            rules = data || [];
        } else {
            // Mock rules for instant testing without DB
            rules = [
                { ingredient_name: 'Butylphenyl Methylpropional', status: 'PROHIBITED', cas_number: '80-54-6', regulation_note: 'Banned in EU Cosmetic Regulation (CMR 1B substance).' },
                { ingredient_name: 'Retinol', status: 'RESTRICTED', cas_number: '68-26-8', max_limit: 0.3, regulation_note: 'Allowed up to 0.3% in face/hand products.' },
                { ingredient_name: 'Red 3', status: 'PROHIBITED', cas_number: '16423-68-0', regulation_note: 'Banned by FDA for cosmetic use.' },
                { ingredient_name: 'Titanium Dioxide', status: 'RESTRICTED', cas_number: '13463-67-7', max_limit: 25.0, regulation_note: 'Approved as a color additive with limits.' },
                { ingredient_name: 'Phenoxyethanol', status: 'RESTRICTED', cas_number: '122-99-6', max_limit: 1.0, regulation_note: 'Maximum concentration in ready for use preparation is 1.0%.' }
            ];
        }

        const safe = [];
        const restricted = [];
        const prohibited = [];

        let totalIssues = 0;
        let score = 100;

        for (const ing of extractedIngredients) {
            // Find if this ingredient has a rule
            const rule = rules?.find(r => ing.toLowerCase().includes(r.ingredient_name.toLowerCase()));

            if (!rule) {
                safe.push({ name: ing, note: 'No specific restrictions found.' });
            } else if (rule.status === 'PROHIBITED') {
                prohibited.push({ name: ing, cas: rule.cas_number, note: rule.regulation_note });
                totalIssues++;
                score -= 30; // arbitrary huge penalty
            } else if (rule.status === 'RESTRICTED') {
                const detectedSim = (Math.random() * (rule.max_limit ? rule.max_limit * 2 : 5)).toFixed(2);
                restricted.push({
                    name: ing,
                    cas: rule.cas_number,
                    allowed_limit: rule.max_limit,
                    detected: Number(detectedSim)
                });
                totalIssues++;
                score -= 10;
            } else {
                safe.push({ name: ing, cas: rule.cas_number });
            }
        }

        // Compile final structured report
        const finalReport = {
            summary: {
                score: Math.max(0, score),
                issues_count: totalIssues,
                status: prohibited.length > 0 ? 'Requires Attention' : restricted.length > 0 ? 'Action Needed' : 'Safe to Export'
            },
            ingredients: { safe, restricted, prohibited }
        };

        // 5. Update Project in DB
        if (!isMockDB) {
            await supabase.from('projects')
                .update({
                    ingredients_json: extractedIngredients,
                    status: 'COMPLETED'
                })
                .eq('id', projectId);
        }

        return NextResponse.json({ success: true, report: finalReport });

    } catch (error: any) {
        console.error('Vision AI error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
