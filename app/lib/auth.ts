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






// // /app/lib/auth.ts
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

// export async function createAdminSession(admin: any): Promise<void> {
//   const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
//   const session = await encrypt({ admin, expires });
  
//   const cookieStore = await cookies();
//   cookieStore.set('admin_session', session, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     expires,
//     path: '/',
//     sameSite: 'lax'
//   });
// }

// export async function getAdminSession(): Promise<any> {
//   const cookieStore = await cookies();
//   const session = cookieStore.get('admin_session')?.value;
  
//   if (!session) return null;
  
//   return await decrypt(session);
// }

// export async function deleteAdminSession(): Promise<void> {
//   const cookieStore = await cookies();
//   cookieStore.delete('admin_session');
// }










// /app/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// ========== ADDED: Debug function for environment check ==========
function debugEnvironment() {
  if (process.env.NODE_ENV === 'production') return; // Don't log sensitive info in production
  

}

// ========== UPDATED: Get JWT secret with validation ==========
function getJwtSecret() {
  const secretKey = process.env.JWT_SECRET;
  
  // Debug in development
  debugEnvironment();
  
  if (!secretKey) {
   
    
    // Only use fallback in development
    if (process.env.NODE_ENV === 'development') {
      
      return new TextEncoder().encode('your-secret-key-change-in-production');
    }
    
    throw new Error('JWT_SECRET is not configured');
  }
  
  if (secretKey.length < 32) {
    console.warn(`⚠️  JWT_SECRET is only ${secretKey.length} characters. Recommended minimum is 32.`);
  }
  
  const key = new TextEncoder().encode(secretKey);
  return key;
}

// ========== UPDATED: Encrypt function with debugging ==========
export async function encrypt(payload: any) {
  try {
    console.log('🔐 Starting JWT encryption...');
    const key = getJwtSecret();
    
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(key);
    
    
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`   First 20 chars: ${token.substring(0, 20)}...`);
    }
    
    return token;
  } catch (error: any) {
   
    throw new Error(`Failed to create session token: ${error.message}`);
  }
}

// ========== UPDATED: Decrypt function with better error handling ==========
export async function decrypt(input: string): Promise<any> {
  try {
    if (!input || typeof input !== 'string') {
      console.error('❌ Invalid input for JWT decryption:', typeof input);
      return null;
    }
    
    const key = getJwtSecret();
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    
    
    return payload;
  } catch (error: any) {
   
    
    // Specific error types
    if (error.code === 'ERR_JWT_EXPIRED') {
     
    } else if (error.code === 'ERR_JWS_INVALID') {
     
    } else if (error.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
     
    }
    
    // Don't throw, just return null for invalid tokens
    return null;
  }
}

// ========== UPDATED: createAdminSession with comprehensive logging ==========
export async function createAdminSession(admin: any): Promise<void> {
  try {
   
    
    // Validate admin data
    if (!admin || !admin._id || !admin.email) {
      throw new Error('Invalid admin data provided to createAdminSession');
    }
    
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const session = await encrypt({ admin, expires });
    
    const cookieStore = await cookies();
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/',
      sameSite: 'lax' as const
    };
 
    
    cookieStore.set('admin_session', session, cookieOptions);
    
   
  } catch (error: any) {
    
    throw error; // Re-throw to be caught by login handler
  }
}

// ========== UPDATED: getAdminSession with debugging ==========
export async function getAdminSession(): Promise<any> {
  try {
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    if (!sessionCookie || !sessionCookie.value) {
     
      return null;
    }
    
    
    const payload = await decrypt(sessionCookie.value);
    
    if (!payload) {
      console.log('   Session decryption returned null');
      return null;
    }
    
    return payload;
  } catch (error: any) {
    console.error('❌ Error getting admin session:', error.message);
    return null;
  }
}

// ========== UPDATED: deleteAdminSession with logging ==========
export async function deleteAdminSession(): Promise<void> {
  try {
    console.log('🗑️  Deleting admin session...');
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    if (sessionCookie) {
      cookieStore.delete('admin_session');
      console.log('✅ Admin session deleted');
    } else {
      console.log('   No session to delete');
    }
  } catch (error: any) {
    console.error('❌ Error deleting admin session:', error.message);
    // Don't throw - this is usually not critical
  }
}

// ========== ADDED: Utility function to validate session ==========
export async function validateSession(): Promise<{ valid: boolean; admin?: any; error?: string }> {
  try {
    const session = await getAdminSession();
    
    if (!session || !session.admin) {
      return { valid: false, error: 'No valid session found' };
    }
    
    // Check if session is expired
    if (session.expires && new Date(session.expires) < new Date()) {
      await deleteAdminSession();
      return { valid: false, error: 'Session expired' };
    }
    
    return { valid: true, admin: session.admin };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}