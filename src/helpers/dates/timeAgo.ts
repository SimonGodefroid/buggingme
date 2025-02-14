export function timeAgo(date: Date): { days: number, hours: number, minutes: number } {
  const now = new Date();
  let diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Difference in seconds

  const days = Math.floor(diff / 86400);
  diff %= 86400;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);

  return { days, hours, minutes };
}

// Example usage:
console.log(timeAgo(new Date(Date.now() - 98765432))); // Replace with any JS date
