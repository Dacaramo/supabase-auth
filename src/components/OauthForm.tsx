'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import GoogleIcon from './icons/GoogleIcon';
import GitHubIcon from './icons/GitHubIcon';

export default function OauthForm() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleOauthSignIn = async (provider: 'google' | 'github') => {
    setLoading(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(null);
      }
      // Si no hay error, el usuario será redirigido automáticamente
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
      setLoading(null);
    }
  };

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <div className='mb-4 p-4 bg-info/10 border border-info/20 rounded-lg'>
          <p className='text-sm text-info'>
            <strong>OAuth:</strong> Inicia sesión de forma segura usando tu
            cuenta existente de Google o GitHub
          </p>
        </div>

        {error && (
          <div className='alert alert-error mb-4'>
            <span className='text-sm'>{error}</span>
          </div>
        )}

        <div className='space-y-3'>
          {/* Google Sign-In */}
          <button
            onClick={() => handleOauthSignIn('google')}
            disabled={loading !== null}
            className='btn w-full flex items-center justify-center gap-3'
          >
            {loading === 'google' ? (
              <span className='loading loading-spinner loading-sm'></span>
            ) : (
              <GoogleIcon />
            )}
            <span>Continuar con Google</span>
          </button>

          {/* GitHub Sign-In */}
          <button
            onClick={() => handleOauthSignIn('github')}
            disabled={loading !== null}
            className='btn w-full flex items-center justify-center gap-3'
          >
            {loading === 'github' ? (
              <span className='loading loading-spinner loading-sm'></span>
            ) : (
              <GitHubIcon className='fill-current' />
            )}
            <span>Continuar con GitHub</span>
          </button>
        </div>

        <div className='mt-6 p-4 bg-base-200 rounded-lg'>
          <p className='text-xs text-base-content/70 text-center'>
            <strong>💡 Configuración OAuth:</strong> Para que funcione en
            producción, debes configurar las credenciales de OAuth en tu
            proyecto de Supabase (Client ID, Client Secret, etc.)
          </p>
        </div>
      </div>
    </div>
  );
}
