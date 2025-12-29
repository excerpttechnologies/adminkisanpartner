// import { SignJWT, jwtVerify } from 'jose';
// import { cookies } from 'next/headers';

// const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// const key = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: any) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('24h')
//     .sign(key);
// }

// export async function decrypt(input: string): Promise<any> {
//   try {
//     const { payload } = await jwtVerify(input, key, {
//       algorithms: ['HS256'],
//     });
//     return payload;
//   } catch (error) {
//     console.error('Failed to verify token:', error);
//     return null;
//   }
// }

// export async function createAdminSession(admin: any) {
//   const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
//   const session = await encrypt({ admin, expires });
  
//   (await cookies()).set('admin_session', session, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     expires,
//     path: '/',
//   });
// }

// export async function getAdminSession() {
//   const session = (await cookies()).get('admin_session')?.value;
//   if (!session) return null;
//   return await decrypt(session);
// }

// export async function deleteAdminSession() {
//   (await cookies()).delete('admin_session');
// }






// /app/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify token:', error);
    return null;
  }
}

export async function createAdminSession(admin: any): Promise<void> {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ admin, expires });
  
  const cookieStore = await cookies();
  cookieStore.set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    path: '/',
    sameSite: 'lax'
  });
}

export async function getAdminSession(): Promise<any> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!session) return null;
  
  return await decrypt(session);
}

export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}