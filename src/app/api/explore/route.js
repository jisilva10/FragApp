import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('perfumes')
      .select('id, name, brand, gender, year, rating, accords, image_url')
      .or(`name.ilike.%${q}%,brand.ilike.%${q}%`)
      .order('rating', { ascending: false })
      .limit(20);

    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to search perfumes' }, { status: 500 });
  }
}
