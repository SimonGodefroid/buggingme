export const isPastDate = (date: Date) => {
  const today = new Date();
  
  // Strip the time portion of both dates
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Return true if the input date is before or equal to today
  return inputDate < currentDate;
};