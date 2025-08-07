'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // Si el email ya está confirmado, redirigir al dashboard
          router.refresh();
          router.push('/dashboard');
        } else {
          // Si necesita confirmar email
          setSuccess(true);
        }
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success === false && (
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
                  placeholder='Mínimo 6 caracteres'
                  className='input input-bordered w-full'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  autoComplete='off'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Confirmar Contraseña</span>
                </label>
                <input
                  type='password'
                  placeholder='Repite tu contraseña'
                  className='input input-bordered w-full'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    'Crear Cuenta'
                  )}
                </button>
              </div>
            </form>

            <div className='divider'>O</div>

            <div className='text-center'>
              <p className='text-sm'>
                ¿Ya tienes cuenta?{' '}
                <Link
                  href='/login'
                  className='link link-primary'
                >
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
      {success === true && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body text-center'>
            <div className='text-4xl mb-4'>📧</div>
            <h3 className='text-lg font-semibold text-success'>
              ¡Registro exitoso!
            </h3>
            <p className='text-sm text-base-content/60'>
              Revisa tu email para confirmar tu cuenta antes de iniciar sesión.
            </p>
            <Link
              href='/login'
              className='btn btn-primary mt-4'
            >
              Ir al Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
