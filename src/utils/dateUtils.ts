export const calculateDaysUntilReturn = (returnDate: string): number => {
  const today = new Date();
  const return_date = new Date(returnDate);
  const diffTime = return_date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateReturnDate = (issuedDate: string): string => {
  const issuedDateObj = new Date(issuedDate);
  issuedDateObj.setDate(issuedDateObj.getDate() + 7); // Add 7 days to the issued date
  return issuedDateObj.toISOString(); // Return in ISO string format
};

export const calculateNextAvailableDate = (returnDate: string, queuePosition: number): string => {
  const baseDate = new Date(returnDate);
  // Add 7 days for each person in queue (including current holder)
  const daysToAdd = (queuePosition) * 7;
  baseDate.setDate(baseDate.getDate() + daysToAdd);
  return baseDate.toISOString();
};