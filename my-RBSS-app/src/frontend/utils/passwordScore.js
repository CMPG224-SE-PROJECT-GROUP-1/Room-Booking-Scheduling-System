export function scorePassword(value){
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[0-9]/.test(value)) score++;
    if (/^A-Za-z0-9/.test(value)) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    return Math.min(score, 5);
}

export const STRENGTH_LABELS = [
  'needs more ink',
  'needs more ink',
  'getting darker',
  'getting darker',
  'strong, full ink',
  'strong, full ink',
];