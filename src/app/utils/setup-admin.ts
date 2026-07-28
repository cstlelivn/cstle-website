/**
 * Admin Account Setup Utility
 * 
 * Use this to create the first admin account for the CMS.
 * After running this once, you can delete this file.
 */

import { projectId, publicAnonKey } from './supabase/info';

export async function createAdminAccount(email: string, password: string, name: string) {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin account created successfully!');
      console.log('Email:', email);
      console.log('You can now log in at /admin');
      return data;
    } else {
      console.error('❌ Error creating admin account:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to create admin account:', error);
    return null;
  }
}

// Example usage (uncomment and run once, then delete):
// createAdminAccount('admin@cstlelivn.com', 'your-secure-password', 'Admin');
