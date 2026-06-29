import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  try {
    let query = supabaseAdmin.from('lists').select('*').order('added_at', { ascending: false });
    
    if (type) {
      query = query.eq('list_type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { perfume_id, name, brand, list_type, comparison_to } = body;
    
    if (!perfume_id || !name || !list_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('lists')
      .insert([{ 
        perfume_id, 
        name, 
        brand: brand || '', 
        list_type, 
        comparison_to: comparison_to || null 
      }])
      .select('id')
      .single();
      
    if (error) throw error;
    
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to add to list' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('lists')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete from list' }, { status: 500 });
  }
}
