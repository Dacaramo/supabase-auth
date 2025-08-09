'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import type { Factor } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export default function MfaPage() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadFactors();
  }, []);

  // Cargar los factores MFA existentes del usuario
  const loadFactors = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      toast.error('Error al cargar factores MFA: ' + error.message);
      return;
    }

    setFactors(data?.totp ?? []);
  };

  // Iniciar configuración MFA
  const enrollMfa = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `TOTP - ${new Date().toLocaleDateString()}`,
    });

    if (error) {
      toast.error('Error al iniciar configuración MFA: ' + error.message);
      return;
    }

    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrollmentId(data.id);
    toast.success('Escanea el código QR con tu app de autenticación');
  };

  const verifyAndActivate = async () => {
    if (!enrollmentId || !verificationCode) return;

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrollmentId,
      code: verificationCode,
    });

    if (error) {
      toast.error('Error al verificar código MFA: ' + error.message);
      return;
    }

    setQrCode(null);
    setSecret(null);
    setEnrollmentId(null);
    setVerificationCode('');
    await loadFactors();
    toast.success('¡MFA configurado exitosamente!');
  };

  const unenrollFactor = async (factorId: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    if (error) {
      toast.error('Error al eliminar factor MFA: ' + error.message);
      return;
    }

    await loadFactors();
    toast.success('Factor MFA eliminado exitosamente');
  };

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold'>Multi-Factor Authentication</h1>
            <p className='text-base-content/60'>
              Configura una capa adicional de seguridad para tu cuenta
            </p>
          </div>

          <div className='space-y-6'>
            {/* Tarjeta que muestra todos los factores MFA del usuario */}
            <div className='card bg-base-100 shadow-xl'>
              <div className='card-body'>
                <h2 className='card-title'>🛡️ Estado de MFA</h2>
                <p className='text-sm text-base-content/60 mb-4'>
                  Multi-Factor Authentication añade una capa extra de seguridad
                  a tu cuenta
                </p>

                {factors.length > 0 && (
                  <div className='space-y-3'>
                    <div className='alert alert-success'>
                      <span>✅ MFA está activado en tu cuenta</span>
                    </div>

                    {factors.map((factor) => (
                      <div
                        key={factor.id}
                        className='flex items-center justify-between p-3 bg-base-100 rounded-lg'
                      >
                        <div>
                          <p className='font-semibold text-sm'>
                            {factor.friendly_name || 'Factor MFA'}
                          </p>
                          <p className='text-xs text-base-content/60'>
                            Tipo: {factor.factor_type.toUpperCase()} • Estado:{' '}
                            {factor.status}
                          </p>
                        </div>
                        <button
                          onClick={() => unenrollFactor(factor.id)}
                          className='btn btn-error btn-sm'
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {factors.length === 0 && (
                  <div className='alert alert-warning bg-warning/10 border border-warning/20'>
                    <span className='text-warning'>
                      ⚠️ MFA no está configurado. Tu cuenta es menos segura.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tarjeta para que el usuario añada factores MFA a su cuenta */}
            {!qrCode && factors.length === 0 && (
              <div className='card bg-base-100 shadow-xl'>
                <div className='card-body'>
                  <h2 className='card-title'>📱 Configurar MFA</h2>
                  <p className='text-sm text-base-content/60 mb-4'>
                    Configura TOTP (Time-based One-Time Password) usando una app
                    como Google Authenticator, Microsoft Authenticator,
                    Bitwarden, etc.
                  </p>

                  <button
                    onClick={enrollMfa}
                    className='btn btn-primary'
                  >
                    Configurar MFA
                  </button>
                </div>
              </div>
            )}

            {/* Tarjeta con código QR para añadir nuevo factor MFA */}
            {qrCode && (
              <div className='card bg-base-100 shadow-xl'>
                <div className='card-body'>
                  <h2 className='card-title'>📷 Escanear Código QR</h2>
                  <p className='text-sm text-base-content/60 mb-4'>
                    Escanea este código QR con tu app de autenticación
                  </p>

                  <div className='flex flex-col items-center space-y-4'>
                    <div className='bg-white p-4 rounded-lg'>
                      <img
                        src={qrCode}
                        alt='QR Code para MFA'
                        className='w-48 h-48'
                      />
                    </div>

                    <div className='text-center'>
                      <p className='text-xs text-base-content/60 mb-2'>
                        O ingresa manualmente este código:
                      </p>
                      <code className='bg-base-100 px-3 py-1 rounded text-xs break-all'>
                        {secret}
                      </code>
                    </div>
                  </div>

                  <div className='divider'>Verificación</div>

                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Código de 6 dígitos</span>
                    </label>
                    <input
                      type='text'
                      placeholder='123456'
                      className='input input-bordered w-full text-center text-2xl tracking-widest'
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(
                          e.target.value.replace(/\D/g, '').slice(0, 6)
                        )
                      }
                      maxLength={6}
                    />
                    <div className='label'>
                      <span className='label-text-alt text-base-content/60'>
                        Ingresa el código generado por tu app de autenticación
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={verifyAndActivate}
                    className='btn btn-success mt-4'
                    disabled={verificationCode.length !== 6}
                  >
                    Verificar y Activar MFA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
