'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import type { Factor } from '@supabase/supabase-js';

export default function MfaSetup() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Cargar factores MFA existentes
  useEffect(() => {
    loadFactors();
  }, []);

  const loadFactors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        setError(error.message);
        return;
      }

      setFactors(data?.totp || []);
    } catch (err) {
      setError('Error al cargar factores MFA');
    } finally {
      setLoading(false);
    }
  };

  const enrollMfa = async () => {
    setEnrollLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `TOTP - ${new Date().toLocaleDateString()}`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setEnrollmentId(data.id);
      setSuccess('Escanea el código QR con tu app de autenticación');
    } catch (err) {
      setError('Error al iniciar configuración MFA');
    } finally {
      setEnrollLoading(false);
    }
  };

  const verifyAndActivate = async () => {
    if (!enrollmentId || !verificationCode) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollmentId,
        code: verificationCode,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('¡MFA configurado exitosamente!');
      setQrCode(null);
      setSecret(null);
      setEnrollmentId(null);
      setVerificationCode('');
      await loadFactors();

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard?message=MFA configurado exitosamente');
      }, 2000);
    } catch (err) {
      setError('Error al verificar código MFA');
    } finally {
      setLoading(false);
    }
  };

  const unenrollFactor = async (factorId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Factor MFA eliminado exitosamente');
      await loadFactors();
    } catch (err) {
      setError('Error al eliminar factor MFA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Status Card */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>🛡️ Estado de MFA</h2>
          <p className='text-sm text-base-content/60 mb-4'>
            Multi-Factor Authentication añade una capa extra de seguridad a tu
            cuenta
          </p>

          {factors.length > 0 ? (
            <div className='space-y-3'>
              <div className='alert alert-success'>
                <span>✅ MFA está activado en tu cuenta</span>
              </div>

              {factors.map((factor) => (
                <div
                  key={factor.id}
                  className='flex items-center justify-between p-3 bg-base-200 rounded-lg'
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
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className='alert alert-warning'>
              <span>
                ⚠️ MFA no está configurado. Tu cuenta es menos segura.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Setup Card */}
      {!qrCode && factors.length === 0 && (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title'>📱 Configurar MFA</h2>
            <p className='text-sm text-base-content/60 mb-4'>
              Configura TOTP (Time-based One-Time Password) usando una app como
              Google Authenticator, Microsoft Authenticator, Bitwarden, etc.
            </p>

            <button
              onClick={enrollMfa}
              className='btn btn-primary'
              disabled={enrollLoading}
            >
              {enrollLoading ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : (
                'Configurar MFA'
              )}
            </button>
          </div>
        </div>
      )}

      {/* QR Code Card */}
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
                <code className='bg-base-200 px-3 py-1 rounded text-xs break-all'>
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
                disabled={loading}
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
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : (
                'Verificar y Activar MFA'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className='alert alert-error'>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className='alert alert-success'>
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
