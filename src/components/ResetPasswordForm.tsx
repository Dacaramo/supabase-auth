'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body text-center'>
          <div className='text-4xl mb-4'>📧</div>
          <h3 className='text-lg font-semibold text-success'>
            ¡Enlace enviado!
          </h3>
          <p className='text-sm text-base-content/60'>
            Revisa tu email <strong>{email}</strong> para el enlace de
            recuperación de contraseña.
          </p>
          <Link
            href='/login'
            className='btn btn-primary mt-4'
          >
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <div className='mb-4 p-4 bg-info/10 border border-info/20 rounded-lg'>
          <p className='text-sm text-info'>
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>
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
                'Enviar Enlace de Recuperación'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
