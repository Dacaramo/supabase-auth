'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
      return;
    }

    router.push('/dashboard');
    toast.success('Has iniciado sesión exitosamente');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Accede a tu cuenta</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Login con tu email y contraseña
          </p>
        </div>

        {/* Formulario de login */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  type='email'
                  placeholder='tu@email.com'
                  className='input input-bordered w-full'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete='off'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Contraseña</span>
                </label>
                <input
                  type='password'
                  placeholder='Tu contraseña'
                  className='input input-bordered w-full'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete='off'
                />
              </div>

              <div className='form-control mt-6'>
                <button
                  type='submit'
                  className='btn btn-primary w-full'
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
