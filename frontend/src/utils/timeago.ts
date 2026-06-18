export function timeAgoConverter(isoString : any) {
  const date = new Date(isoString);
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Jika waktu komputer lebih lambat atau baru saja
  if (secondsPast < 5) {
    return 'baru saja';
  }

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  // Menggunakan API bawaan browser untuk format bahasa lokal ('id' untuk Indonesia)
  const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'always' });

  for (const [unit, value] of Object.entries(intervals)) {
    if (secondsPast >= value) {
      const count = Math.floor(secondsPast / value);
      return rtf.format(-count, unit as any); // Nilai minus (-) untuk menandakan "yang lalu"
    }
  }
}
