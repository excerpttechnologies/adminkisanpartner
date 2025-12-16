import Subcategory from "../models/Subcategory";

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

///generate SubcategoryID
const subcategoryID=async()=>{
   const lastRecord = await Subcategory.findOne({
    subCategoryId: { $exists: true }
  })
    .sort({ subCategoryId: -1 })
    .select("subCategoryId")
    .lean();
  
  const nextID = generateNextId(lastRecord?.subCategoryId, "SUB");
  return nextID
}

//generate SubcategoryID
const subcategoryID=async()=>{
   const lastRecord = await Subcategory.findOne({
    subCategoryId: { $exists: true }
  })
    .sort({ subCategoryId: -1 })
    .select("subCategoryId")
    .lean();
  
  const nextID = generateNextId(lastRecord?.subCategoryId, "SUB");
  return nextID
}

export {generateNextId,subcategoryID}
