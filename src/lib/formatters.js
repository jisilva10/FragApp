// Formats text to Title Case (e.g., "fruity notes" -> "Fruity Notes")
export function toTitleCase(str) {
  if (!str) return '';
  return str.split(',').map(part => {
    return part.trim().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }).join(', ');
}

// Maps accord names to premium emojis
const accordEmojis = {
  'citrus': '🍋',
  'woody': '🪵',
  'floral': '🌸',
  'white floral': '🌼',
  'fruity': '🍒',
  'sweet': '🍬',
  'vanilla': '🍦',
  'aromatic': '🌿',
  'fresh spicy': '🌱',
  'warm spicy': '🌶️',
  'musky': '☁️',
  'powdery': '💨',
  'leather': '👞',
  'earthy': '🌍',
  'patchouli': '🍃',
  'green': '☘️',
  'rose': '🌹',
  'amber': '🍯',
  'balsamic': ' resins',
  'aquatic': '🌊',
  'marine': '🌊',
  'smoky': '🚬',
  'oud': '🪵',
  'coconut': '🥥',
  'tropical': '🍍',
  'nutty': '🌰',
  'caramel': '🍮',
  'coffee': '☕'
};

export function getAccordIcon(accord) {
  if (!accord) return '';
  const lowerAccord = accord.toLowerCase().trim();
  return accordEmojis[lowerAccord] || '✨';
}

export function formatAccord(accord) {
  const icon = getAccordIcon(accord);
  const title = toTitleCase(accord);
  return `${icon} ${title}`;
}
