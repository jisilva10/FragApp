import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use admin to bypass RLS for updates

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  
  try {
    // 1. Check if we already have the image cached in Supabase
    const { data: perfume, error } = await supabaseAdmin
      .from('perfumes')
      .select('name, brand, image_url')
      .eq('id', id)
      .single();
      
    if (error || !perfume) return NextResponse.json({ error: 'Perfume not found' }, { status: 404 });
    
    // 2. If image_url exists, return it
    if (perfume.image_url) {
      return NextResponse.json({ url: perfume.image_url });
    }
    
    // 3. If not, check if we have the API keys to search Google
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    
    if (!apiKey || !cx) {
       // Return 404 so frontend knows to use placeholder
       return NextResponse.json({ error: 'Google API Keys not configured' }, { status: 404 });
    }
    
    // 4. Fetch from Google Custom Search
    // We add "perfume bottle high quality studio" to get professional images
    const query = encodeURIComponent(`${perfume.name} ${perfume.brand} perfume bottle high quality studio`);
    const googleRes = await fetch(`https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&key=${apiKey}&q=${query}&searchType=image&num=1`);
    const googleData = await googleRes.json();
    
    if (googleData.items && googleData.items.length > 0) {
      const imageUrl = googleData.items[0].link;
      
      // 5. Save to Supabase (cache it forever)
      await supabaseAdmin
        .from('perfumes')
        .update({ image_url: imageUrl })
        .eq('id', id);
        
      return NextResponse.json({ url: imageUrl });
    } else {
      console.error('Google API Error or empty:', googleData);
      return NextResponse.json({ error: 'No image found', debug: googleData }, { status: 404 });
    }
    
  } catch (err) {
    console.error('Image API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
