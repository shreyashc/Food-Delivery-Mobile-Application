export const getFormattedDate = (dateStr: string) => {
  let date = new Date(dateStr);
  return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
};
