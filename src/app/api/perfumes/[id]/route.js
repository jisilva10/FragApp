import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('perfumes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      return NextResponse.json({ error: 'Perfume not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch perfume details' }, { status: 500 });
  }
}
