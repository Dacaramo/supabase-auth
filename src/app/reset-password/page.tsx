'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'sent'>('form');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/callback?type=recovery`,
    });

    if (error) {
      toast.error('Error al restablecer la contraseña: ' + error.message);
      return;
    }

    setStep('sent');
    toast.success('Email enviado');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Recuperar Contraseña</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Ingresa tu email para recibir un enlace de recuperación
          </p>
        </div>

        {/* Si el step es form se muestra form para enviar el email */}
        {step === 'form' && (
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
                    autoComplete='off'
                  />
                </div>

                <div className='form-control mt-6'>
                  <button
                    type='submit'
                    className='btn btn-primary w-full'
                  >
                    Enviar Enlace de Recuperación
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Si el step es sent se muestra mensaje de confirmación */}
        {step === 'sent' && (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
