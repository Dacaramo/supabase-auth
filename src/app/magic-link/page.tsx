'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import toast from 'react-hot-toast';

export default function MagicLinkPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/callback`,
      },
    });

    if (error) {
      toast.error('Error al enviar Magic Link: ' + error.message);
      return;
    }

    setStep('confirmation');
    toast.success('Magic Link enviado');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Magic Link</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Inicia sesión sin contraseña usando un enlace mágico
          </p>
        </div>

        {/* Si el step es form se muestra el formulario */}
        {step === 'form' && (
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <div className='mb-4 p-4 bg-info/10 border border-info/20 rounded-lg'>
                <p className='text-sm text-info'>
                  <strong>Magic Link:</strong> Inicia sesión sin contraseña.
                  Solo ingresa tu email y te enviaremos un enlace seguro
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
                    autoComplete='off'
                  />
                </div>

                <div className='form-control mt-6'>
                  <button
                    type='submit'
                    className='btn btn-primary w-full'
                  >
                    Enviar Magic Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Si el step es confirmation se muestra un mensaje de confirmación */}
        {step === 'confirmation' && (
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
      </div>
    </div>
  );
}
