'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import type { Factor } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export default function MfaChallengePage() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [currentFactorId, setCurrentFactorId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadFactorsAndChallenge();
  }, []);

  const loadFactorsAndChallenge = async () => {
    const { data: factorsData, error: factorsError } =
      await supabase.auth.mfa.listFactors();

    if (factorsError) {
      toast.error('Error al cargar factores MFA: ' + factorsError.message);
      return;
    }

    const verifiedFactors =
      factorsData?.totp?.filter((factor) => factor.status === 'verified') ?? [];
    setFactors(verifiedFactors);

    if (verifiedFactors.length === 0) {
      router.push('/mfa-config');
      toast.error(
        'No tienes factores MFA configurados. Configúralos antes de completar el challenge'
      );
      return;
    }

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId: verifiedFactors[0].id,
      });

    if (challengeError) {
      toast.error('Error al crear challenge MFA: ' + challengeError.message);
      return;
    }

    setChallengeId(challengeData.id);
    setCurrentFactorId(verifiedFactors[0].id);
  };

  const verifyChallenge = async () => {
    if (!challengeId || !currentFactorId || !verificationCode) return;

    const { error } = await supabase.auth.mfa.verify({
      challengeId,
      factorId: currentFactorId,
      code: verificationCode,
    });

    if (error) {
      toast.error('Error al verificar código MFA: ' + error.message);
      return;
    }

    toast.success('¡Autenticación MFA exitosa!');
    router.push('/dashboard');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='container mx-auto px-4'>
        <div className='max-w-md mx-auto'>
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h1 className='card-title text-2xl mb-4'>🔐 Verificación MFA</h1>
              <p className='text-base-content/60 mb-6'>
                Para continuar con esta acción, necesitas verificar tu identidad
                usando tu aplicación de autenticación.
              </p>

              {/* Formulario para completar el challenge MFA */}
              {factors.length > 0 && (
                <div className='space-y-4'>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Código de verificación</span>
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
                      autoFocus
                    />
                    <div className='label'>
                      <span className='label-text-alt text-base-content/60'>
                        Ingresa el código de 6 dígitos de tu app de
                        autenticación
                      </span>
                    </div>
                  </div>

                  <div className='card-actions justify-end'>
                    <button
                      onClick={verifyChallenge}
                      className={'btn btn-primary'}
                    >
                      Verificar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
