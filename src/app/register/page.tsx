'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'form' | 'confirmation'>('form');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/callback`,
      },
    });

    if (error) {
      toast.error('Error al crear cuenta: ' + error.message);
      return;
    }

    setStep('confirmation');
    toast.success('Revisa tu email para confirmar tu cuenta');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Crear Cuenta</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Regístrate con email y contraseña
          </p>
        </div>

        {/* Si el step es form se muestra el formulario de registro */}
        {step === 'form' && (
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
                    placeholder='Mínimo 6 caracteres'
                    className='input input-bordered w-full'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                    autoComplete='off'
                  />
                </div>

                <div className='form-control mt-6'>
                  <button
                    type='submit'
                    className='btn btn-primary w-full'
                  >
                    Crear Cuenta
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

        {/* Si el step es confirmation se muestra mensaje de confirmación */}
        {step === 'confirmation' && (
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body text-center'>
              <div className='text-4xl mb-4'>📧</div>
              <h3 className='text-lg font-semibold text-success'>
                ¡Registro exitoso!
              </h3>
              <p className='text-sm text-base-content/60'>
                Revisa tu email para confirmar tu cuenta antes de iniciar
                sesión.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
