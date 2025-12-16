 const generateNextId = (
  lastId: string | undefined | null,
  prefix: string
) => {
  if (!lastId) {
    return `${prefix}001`;
  }

  const number = parseInt(lastId.replace(prefix, ""), 10);

  if (isNaN(number)) {
    return `${prefix}001`;
  }

  return `${prefix}${String(number + 1).padStart(3, "0")}`;
};
