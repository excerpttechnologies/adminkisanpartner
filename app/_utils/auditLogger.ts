




import AuditLog from "@/app/models/AuditLog";
import { NextRequest } from "next/server";
 import { Types } from "mongoose";
interface AuditLogParams {
  request: NextRequest;

  actorId: Types.ObjectId | string;

  actorRole: "admin" | "subadmin";
  action: string;
  module: string;
  targetId?: string;
  description: string;
  changes?: Record<string, { old: any; new: any }>;

}

export async function createAuditLog({
  request,
  actorId,
  actorRole,
  action,
  module,
  targetId,
  description,
  changes,
}: AuditLogParams)
 {
  try {
await AuditLog.create({
  actorId,
  actorRole,
  action,
  module,
  targetId,
  description,
  changes: changes || {},
  ipAddress: request.headers.get("x-forwarded-for") || "",
  userAgent: request.headers.get("user-agent") || "",
});

  } catch (error) {
    console.error("Audit log error:", error);
  }
}

// export function getChanges(oldDoc: any, newData: any) {
//   const changes: Record<string, { old: any; new: any }> = {};

//   for (const key in newData) {
//     if (
//       oldDoc[key] !== undefined &&
//       JSON.stringify(oldDoc[key]) !== JSON.stringify(newData[key])
//     ) {
//       changes[key] = {
//         old: oldDoc[key],
//         new: newData[key],
//       };
//     }
//   }

//   return changes;
// }

// FIXED getChanges function
export function getChanges(oldDoc: any, newData: any) {
  const changes: Record<string, { old: any; new: any }> = {};

  // Helper to compare values
  const isEqual = (a: any, b: any) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Check each field in newData
  for (const key in newData) {
    // Handle nested objects (like personalInfo)
    if (newData[key] && typeof newData[key] === 'object' && !Array.isArray(newData[key])) {
      // For nested objects, check each sub-field
      for (const subKey in newData[key]) {
        const oldValue = oldDoc[key]?.[subKey];
        const newValue = newData[key][subKey];
        
        // Only add to changes if they're different
        if (!isEqual(oldValue, newValue)) {
          const fullKey = `${key}.${subKey}`;
          
          // Mask sensitive data
          if (subKey.includes('password') || subKey.includes('mpin') || subKey.includes('accountNumber')) {
            changes[fullKey] = {
              old: oldValue ? '********' : 'Empty',
              new: newValue ? '********' : 'Empty'
            };
          } else {
            changes[fullKey] = {
              old: oldValue !== undefined ? oldValue : 'Empty',
              new: newValue !== undefined ? newValue : 'Empty'
            };
          }
        }
      }
    } else {
      // Handle flat fields
      const oldValue = oldDoc[key];
      const newValue = newData[key];
      
      if (!isEqual(oldValue, newValue)) {
        // Mask sensitive data
        if (key.includes('password') || key.includes('mpin') || key.includes('accountNumber')) {
          changes[key] = {
            old: oldValue ? '********' : 'Empty',
            new: newValue ? '********' : 'Empty'
          };
        } else {
          changes[key] = {
            old: oldValue !== undefined ? oldValue : 'Empty',
            new: newValue !== undefined ? newValue : 'Empty'
          };
        }
      }
    }
  }

  return changes;
}