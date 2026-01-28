// app/actions/auth-actions.ts
'use server';

import { getAdminSession } from '@/app/lib/auth';

export async function getAdminSessionAction() {
  return await getAdminSession();
}