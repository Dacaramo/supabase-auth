'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.refresh();
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
              disabled={loading}
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
              disabled={loading}
              autoComplete='off'
            />
          </div>

          {error && (
            <div className='alert alert-error'>
              <span className='text-sm'>{error}</span>
            </div>
          )}

          <div className='form-control mt-6'>
            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={loading}
            >
              {loading ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        <div className='divider'>O</div>

        <div className='text-center space-y-2'>
          <p className='text-sm'>
            ¿No tienes cuenta?{' '}
            <Link
              href='/register'
              className='link link-primary'
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
