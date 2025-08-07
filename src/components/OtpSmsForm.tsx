'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';

export default function OtpSmsForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar formato de teléfono
    if (phone.length < 10) {
      setError('Ingresa un número de teléfono válido');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
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
        phone,
        token: otp,
        type: 'sms',
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
        phone: phone,
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
      {step === 'phone' && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <div className='mb-4 p-4 bg-info/10 border border-info/20 rounded-lg'>
              <p className='text-sm text-info'>
                <strong>OTP por SMS:</strong> Te enviaremos un código de 6
                dígitos a tu número de teléfono para iniciar sesión.
              </p>
            </div>

            <form
              onSubmit={handleSendOtp}
              className='space-y-4'
            >
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Número de Teléfono</span>
                </label>
                <input
                  type='tel'
                  placeholder='+57 300 123 4567'
                  className='input input-bordered w-full'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                    'Enviar Código SMS'
                  )}
                </button>
              </div>
            </form>

            <div className='mt-6 p-4 bg-base-200 rounded-lg'>
              <p className='text-xs text-base-content/70 text-center'>
                <strong>💡 Nota:</strong> OTP por SMS requiere configuración de
                proveedor (Twilio, MessageBird, etc.) en tu proyecto de Supabase
              </p>
            </div>
          </div>
        </div>
      )}
      {step === 'otp' && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <div className='text-center mb-4'>
              <div className='text-4xl mb-2'>📱</div>
              <p className='text-sm text-base-content/60'>
                Hemos enviado un código SMS a <strong>{phone}</strong>
              </p>
            </div>

            <form
              onSubmit={handleVerifyOtp}
              className='space-y-4'
            >
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Código SMS</span>
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
                    Ingresa el código de 6 dígitos recibido por SMS
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
                    'Verificar Código SMS'
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
                {loading ? 'Enviando...' : 'Reenviar SMS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
