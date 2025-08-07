'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';

export default function OtpEmailForm() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setStep('otp');
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
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

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setError('Nuevo código enviado');
    } catch (err) {
      setError('Error al reenviar código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 'email' && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <div className='mb-4 p-4 bg-info/10 border border-info/20 rounded-lg'>
              <p className='text-sm text-info'>
                <strong>OTP por Email:</strong> Te enviaremos un código de 6
                dígitos a tu email para iniciar sesión de forma segura
              </p>
            </div>

            <form
              onSubmit={handleSendOtp}
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
                    'Enviar Código OTP'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {step === 'otp' && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <div className='text-center mb-4'>
              <div className='text-4xl mb-2'>📧</div>
              <p className='text-sm text-base-content/60'>
                Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
              </p>
            </div>

            <form
              onSubmit={handleVerifyOtp}
              className='space-y-4'
            >
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Código OTP</span>
                </label>
                <input
                  type='text'
                  placeholder='123456'
                  className='input input-bordered w-full text-center text-2xl tracking-widest'
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  required
                  disabled={loading}
                  maxLength={6}
                  minLength={6}
                  autoComplete='off'
                />
                <div className='label'>
                  <span className='label-text-alt text-base-content/60'>
                    Ingresa el código de 6 dígitos
                  </span>
                </div>
              </div>

              {error && (
                <div
                  className={`alert ${
                    error === 'Nuevo código enviado'
                      ? 'alert-success'
                      : 'alert-error'
                  }`}
                >
                  <span className='text-sm'>{error}</span>
                </div>
              )}

              <div className='form-control mt-6'>
                <button
                  type='submit'
                  className='btn btn-primary w-full'
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <span className='loading loading-spinner loading-sm'></span>
                  ) : (
                    'Verificar Código'
                  )}
                </button>
              </div>
            </form>

            <div className='divider'>O</div>

            <div className='text-center space-y-2'>
              <button
                onClick={handleResendOtp}
                className='btn btn-outline btn-sm'
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Reenviar Código'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
