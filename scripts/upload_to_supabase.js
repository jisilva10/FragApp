const { createClient } = require('@supabase/supabase-js');
const Database = require('better-sqlite3');

const supabaseUrl = 'https://wjtdyyasyrpapdshoxvj.supabase.co';
// We use the secret key to bypass RLS and limits during bulk insert
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const db = new Database('./fragrantica.db');

async function uploadData() {
  console.log('Fetching perfumes from local SQLite...');
  const perfumes = db.prepare('SELECT * FROM perfumes').all();
  console.log(`Found ${perfumes.length} perfumes. Uploading to Supabase...`);

  // Supabase limits payload size, so we insert in batches of 1000
  // Formatter helper
  const toTitleCase = (str) => {
    if (!str) return '';
    return str.split(',').map(part => {
      return part.trim().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(' ');
    }).join(', ');
  };

  const BATCH_SIZE = 1000;
  for (let i = 0; i < perfumes.length; i += BATCH_SIZE) {
    const batch = perfumes.slice(i, i + BATCH_SIZE).map(p => ({
      id: p.id,
      name: toTitleCase(p.name),
      brand: toTitleCase(p.brand),
      gender: p.gender,
      rating: p.rating,
      year: p.year,
      top_notes: toTitleCase(p.top_notes),
      middle_notes: toTitleCase(p.middle_notes),
      base_notes: toTitleCase(p.base_notes),
      accords: p.accords ? p.accords.split(',').map(a => a.trim().toLowerCase()).join(',') : '', // Accords are mapped by lower case, we format in UI or DB? Let's format DB to lower, and format in UI with emojis.
      description: p.description,
      url: p.url,
      image_url: null
    }));

    const { data, error } = await supabase
      .from('perfumes')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Error uploading batch ${i / BATCH_SIZE + 1}:`, error.message);
    } else {
      console.log(`Successfully uploaded batch ${i / BATCH_SIZE + 1} (${batch.length} items)`);
    }
  }
  
  console.log('Migration complete!');
}

uploadData().catch(console.error);
