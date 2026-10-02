export const TIMES = ['09:00', '11:00', '15:00', '17:00', '19:00'];
export const SLOT_HOURS = 2;
export const CHECK_IN_GRACE_MINUTES = 15;

export function addHours(time, hours) {
    const [hrs, mins] = time.split(':').map(Number);
    const newHour = (hrs + hours) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function toIso(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}

export function formatDisplayDate(dateStr) {
    return new Date(`${dateStr}T00:00:00`)
        .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        .toUpperCase();
}