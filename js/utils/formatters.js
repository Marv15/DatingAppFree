// Formatting helpers for streaks, dates, times, age, and milestone durations.

export function getLocaleString(lang = 'en') {
  return lang === 'de' ? 'de-DE' : 'en-US';
}

export function formatStreak(ms, t = (k, p) => `${k}`) {
  const totalSecs = Math.floor(Math.max(0, ms) / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);

  if (d > 0) return t('streak_days_hours', { d, h });
  if (h > 0) return t('streak_hours_mins', { h, m });
  return t('streak_mins', { m });
}

export function formatShortTime(ms, t = (k, p) => `${k}`) {
  const totalSecs = Math.floor(Math.max(0, ms) / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);

  if (d > 0) return t('time_ago_days', { d });
  if (h > 0) return t('time_ago_hours', { h });
  return t('time_ago_less_hour');
}

export function formatDateShort(isoDate, lang = 'en') {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return '';
  const locale = getLocaleString(lang);
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

export function formatDateTime(isoDate, lang = 'en') {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return '';
  const locale = getLocaleString(lang);
  return `${d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
}

export function formatMilestoneHours(hours, lang = 'en') {
  const isDe = lang === 'de';
  if (hours < 24) return isDe ? `${hours} Std.` : `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 60) {
    if (days === 1) return isDe ? '1 Tag' : '1 Day';
    return isDe ? `${days} Tage` : `${days} Days`;
  }
  const months = Math.round(days / 30);
  if (months < 12) {
    if (months === 1) return isDe ? '1 Monat' : '1 Month';
    return isDe ? `${months} Monate` : `${months} Months`;
  }
  return isDe ? '1 Jahr' : '1 Year';
}

export function calculateAge(dobStr, now = new Date()) {
  if (!dobStr) return null;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return null;
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export function getDaysUntilBirthday(dobStr, now = new Date()) {
  if (!dobStr) return null;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisYearBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  let diffMs = thisYearBday.getTime() - today.getTime();
  if (diffMs < 0) {
    const nextYearBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    diffMs = nextYearBday.getTime() - today.getTime();
  }
  const days = Math.ceil(diffMs / (24 * 3600 * 1000));
  return (days >= 0 && days <= 30) ? days : null;
}
