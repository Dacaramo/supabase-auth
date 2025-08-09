'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OtpSmsPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) {
      toast.error('Error al enviar OTP por SMS: ' + error.message);
      return;
    }

    setStep('otp');
    toast.success('Código enviado');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      toast.error('Error al verificar OTP: ' + error.message);
      return;
    }

    router.push('/dashboard');
    toast.success('Has iniciado sesión exitosamente');
  };

  const handleResendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) {
      toast.error('Error al reenviar el OTP por SMS' + error.message);
      return;
    }

    toast.success('Nuevo código enviado');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>OTP por SMS</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Inicia sesión con un código enviado a tu teléfono
          </p>
        </div>

        {/* Si el step es phone se muestra el formulario de phone*/}
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
                    autoComplete='off'
                  />
                </div>

                <div className='form-control mt-6'>
                  <button
                    type='submit'
                    className='btn btn-primary w-full'
                  >
                    Enviar Código SMS
                  </button>
                </div>
              </form>

              <div className='mt-6 p-4 bg-base-100 rounded-lg'>
                <p className='text-xs text-base-content/70 text-center'>
                  <strong>💡 Nota:</strong> OTP por SMS requiere configuración
                  de proveedor (Twilio, MessageBird, etc.) en tu proyecto de
                  Supabase
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Si el step es otp se muestra el formulario de otp */}
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

                <div className='form-control mt-6'>
                  <button
                    type='submit'
                    className='btn btn-primary w-full'
                    disabled={otp.length !== 6}
                  >
                    Verificar Código SMS
                  </button>
                </div>
              </form>

              <div className='divider'>O</div>

              <div className='text-center space-y-2'>
                <button
                  onClick={handleResendOtp}
                  className='btn btn-outline btn-sm'
                >
                  Reenviar SMS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
