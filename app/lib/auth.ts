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
  
  console.log('🔧 Auth Environment Debug:');
  console.log('   NODE_ENV:', process.env.NODE_ENV);
  console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('   JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
  console.log('   Using fallback secret:', !process.env.JWT_SECRET);
}

// ========== UPDATED: Get JWT secret with validation ==========
function getJwtSecret() {
  const secretKey = process.env.JWT_SECRET;
  
  // Debug in development
  debugEnvironment();
  
  if (!secretKey) {
    console.error('❌ JWT_SECRET is not set in environment variables!');
    console.error('   Please set JWT_SECRET in your .env.local or production environment');
    
    // Only use fallback in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Using development fallback secret');
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
    
    console.log('✅ JWT encryption successful');
    console.log(`   Token length: ${token.length} characters`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`   First 20 chars: ${token.substring(0, 20)}...`);
    }
    
    return token;
  } catch (error: any) {
    console.error('❌ JWT encryption failed:', error.message);
    console.error('Encryption error details:', error);
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
    
    console.log('🔍 Attempting JWT decryption...');
    console.log(`   Input length: ${input.length} characters`);
    
    const key = getJwtSecret();
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    
    console.log('✅ JWT decryption successful');
    console.log(`   Payload keys: ${Object.keys(payload || {}).join(', ')}`);
    
    return payload;
  } catch (error: any) {
    console.error('❌ Failed to verify JWT token:', error.message);
    
    // Specific error types
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.error('   Token has expired');
    } else if (error.code === 'ERR_JWS_INVALID') {
      console.error('   Invalid JWT signature');
    } else if (error.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
      console.error('   JWT claim validation failed');
    }
    
    // Don't throw, just return null for invalid tokens
    return null;
  }
}

// ========== UPDATED: createAdminSession with comprehensive logging ==========
export async function createAdminSession(admin: any): Promise<void> {
  try {
    console.log('🎫 === Creating Admin Session ===');
    console.log(`   For admin: ${admin.email}`);
    console.log(`   Admin ID: ${admin._id}`);
    console.log(`   Admin role: ${admin.role}`);
    
    // Validate admin data
    if (!admin || !admin._id || !admin.email) {
      throw new Error('Invalid admin data provided to createAdminSession');
    }
    
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    console.log(`   Session will expire: ${expires.toISOString()}`);
    
    const session = await encrypt({ admin, expires });
    
    console.log('🍪 Setting session cookie...');
    const cookieStore = await cookies();
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/',
      sameSite: 'lax' as const
    };
    
    console.log('   Cookie options:', {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      expires: cookieOptions.expires.toISOString(),
      path: cookieOptions.path,
      sameSite: cookieOptions.sameSite
    });
    
    cookieStore.set('admin_session', session, cookieOptions);
    
    console.log('✅ Admin session created successfully');
    console.log('====================================');
  } catch (error: any) {
    console.error('❌ Failed to create admin session:', error.message);
    console.error('Session creation error stack:', error.stack);
    throw error; // Re-throw to be caught by login handler
  }
}

// ========== UPDATED: getAdminSession with debugging ==========
export async function getAdminSession(): Promise<any> {
  try {
    console.log('🔍 Checking admin session...');
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      console.log('   No admin session cookie found');
      return null;
    }
    
    console.log(`   Session cookie found, length: ${sessionCookie.value.length}`);
    
    const payload = await decrypt(sessionCookie.value);
    
    if (!payload) {
      console.log('   Session decryption returned null');
      return null;
    }
    
    console.log(`   Session valid, admin: ${payload.admin?.email || 'Unknown'}`);
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