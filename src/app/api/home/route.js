import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour since home doesn't change often

export async function GET() {
  try {
    const { data: populares, error: popError } = await supabaseAdmin
      .from('perfumes')
      .select('id, name, brand, gender, rating, image_url')
      .order('rating', { ascending: false })
      .limit(10);

    const { data: clasicos, error: claError } = await supabaseAdmin
      .from('perfumes')
      .select('id, name, brand, gender, year, image_url')
      .neq('year', '')
      .lt('year', '2000')
      .gt('year', '1900')
      .order('rating', { ascending: false })
      .limit(10);

    const { data: novedades, error: novError } = await supabaseAdmin
      .from('perfumes')
      .select('id, name, brand, gender, year, image_url')
      .neq('year', '')
      .gte('year', '2023')
      .order('id', { ascending: false })
      .limit(10);

    if (popError || claError || novError) throw new Error('Supabase query error');

    return NextResponse.json({
      populares: populares || [],
      clasicos: clasicos || [],
      novedades: novedades || []
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
  }
}
