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
    // 3. Check if we have the SerpApi key
    const serpApiKey = process.env.SERPAPI_KEY;
    
    if (!serpApiKey) {
       // Return 404 so frontend knows to use placeholder
       return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 404 });
    }
    
    // 4. Fetch from SerpApi
    // We add "perfume bottle high quality studio" to get professional images
    const query = `${perfume.name} ${perfume.brand} perfume bottle high quality studio`;
    const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=isch&ijn=0&api_key=${serpApiKey}`);
    const data = await response.json();

    if (data.images_results && data.images_results.length > 0) {
      const imageUrl = data.images_results[0].original;
      
      // 5. Save to Supabase (cache it forever)
      await supabaseAdmin
        .from('perfumes')
        .update({ image_url: imageUrl })
        .eq('id', id);
        
      return NextResponse.json({ url: imageUrl });
    } else {
      console.error('SerpApi Error or empty:', data);
      return NextResponse.json({ error: 'No image found', debug: data }, { status: 404 });
    }
    
  } catch (err) {
    console.error('Image API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
