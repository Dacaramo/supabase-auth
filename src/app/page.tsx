'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center space-y-8'>
          <div className='space-y-4'>
            <h1 className='text-5xl font-bold text-primary'>Supabase Auth</h1>
            <h2 className='text-3xl font-semibold'>Guía Definitiva</h2>
          </div>
          <div className='mt-12 p-6 bg-base-100 rounded-lg shadow-lg max-w-2xl mx-auto'>
            <h3 className='text-lg font-semibold mb-4'>
              Todo lo que puedes hacer con Supabase Auth
            </h3>
            <div className='grid sm:grid-cols-2 gap-3 text-sm'>
              <Link
                href='/register'
                className='link link-info'
              >
                • Crear Cuenta con Email y Contraseña 📩
              </Link>
              <Link
                href='/login'
                className='link link-info'
              >
                • Login con Email y Contraseña 📩
              </Link>
              <Link
                href='/magic-link'
                className='link link-info'
              >
                • Login con Magic Links ✨
              </Link>
              <Link
                href='/otp-sms'
                className='link link-info'
              >
                • Login con OTP por SMS 📱
              </Link>
              <Link
                href='/oauth'
                className='link link-info'
              >
                • Login con OAuth Providers 🗝️
              </Link>
              <Link
                href='/reset-password'
                className='link link-info'
              >
                • Olvidé mi contraseña 🔃
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
