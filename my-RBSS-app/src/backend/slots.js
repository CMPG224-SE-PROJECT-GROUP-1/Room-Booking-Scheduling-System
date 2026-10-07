export const TIMES = ['09:00', '11:00', '15:00', '17:00', '19:00'];
export const SLOT_HOURS = 2;
export const CHECK_IN_GRACE_MINUTES = 15;

export const DAYS_AHEAD = 28;
export const DAYS_PER_PAGE = 7;
export const IDLE_LOGOUT_MINUTES = 0.5;
export const SLOW_LOAD_SECONDS = 15;
export const MAX_LOGIN_ATTEMPTS = 3;
export const LOGIN_LOCK_SECONDS = 60;

// addHours('15:00', 2) -> '17:00'
export function addHours(time, hours) {
    const [h, m] = time.split(':').map(Number);
    const newHour = (h + hours) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}


export function toIso(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}

// '2026-10-24' -> 'OCT 24, 2026'
export function formatDisplayDate(dateStr) {
    return new Date(`${dateStr}T00:00:00`)
        .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        .toUpperCase();
}