'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';

export default function MagicLinkForm() {
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
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/callback`,
        },
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

  return (
    <>
      {success === false && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <div className='mb-4 p-4 bg-info/10 border border-info/20 rounded-lg'>
              <p className='text-sm text-info'>
                <strong>Magic Link:</strong> Inicia sesión sin contraseña. Solo
                ingresa tu email y te enviaremos un enlace seguro
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
                    'Enviar Magic Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {success === true && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body text-center'>
            <div className='text-4xl mb-4'>✨</div>
            <h3 className='text-lg font-semibold text-success'>
              ¡Magic Link enviado!
            </h3>
            <p className='text-sm text-base-content/60'>
              Hemos enviado un enlace mágico a <strong>{email}</strong>. Haz
              clic en el enlace para iniciar sesión automáticamente.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
