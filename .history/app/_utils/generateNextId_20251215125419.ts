export const generateNextId = (
  lastId: string | null,
  prefix: string
) => {
  if (!lastId) return `${prefix}001`;

  const number = parseInt(lastId.replace(prefix, ""), 10) + 1;
  return `${prefix}${number.toString().padStart(3, "0")}`;
};
