import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { productName, targetMarket, category } = await req.json();

        if (!productName || !targetMarket || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const isMockDB = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder.supabase.co');

        if (isMockDB) {
            console.log("Using Mock DB for Project Creation");
            return NextResponse.json({ id: 'demo-project-' + Date.now() });
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    product_name: productName,
                    target_market: targetMarket,
                    category: category,
                    status: 'PENDING'
                }
            ])
            .select('id')
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        return NextResponse.json({ id: data.id });
    } catch (error: any) {
        console.error('Project creation failed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
