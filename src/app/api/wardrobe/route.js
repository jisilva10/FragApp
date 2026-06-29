import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('wardrobe')
      .select('*')
      .order('added_at', { ascending: false });
      
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch wardrobe' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { perfume_id, name, brand, notes, occasions } = body;
    
    if (!perfume_id || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('wardrobe')
      .insert([{ 
        perfume_id, 
        name, 
        brand: brand || '', 
        notes: notes || '', 
        occasions: occasions || '' 
      }])
      .select('id')
      .single();
      
    if (error) throw error;
    
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to add to wardrobe' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, notes, occasions } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('wardrobe')
      .update({ notes: notes || '', occasions: occasions || '' })
      .eq('id', id);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update wardrobe' }, { status: 500 });
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
      .from('wardrobe')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete from wardrobe' }, { status: 500 });
  }
}
