'use client';

import { createClient } from '@/supabase/client';
import GoogleIcon from '@/icons/GoogleIcon';
import GitHubIcon from '@/icons/GitHubIcon';
import toast from 'react-hot-toast';

export default function OauthPage() {
  const supabase = createClient();

  const handleOauthSignIn = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/callback`,
      },
    });

    if (error) {
      toast.error(`Error al iniciar sesión con ${provider}: ` + error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>OAuth Providers</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Inicia sesión con tu cuenta de Google o GitHub
          </p>
        </div>

        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <div className='mb-4 p-4 bg-info/10 border border-info/20 rounded-lg'>
              <p className='text-sm text-info'>
                <strong>OAuth:</strong> Inicia sesión de forma segura usando tu
                cuenta existente de Google o GitHub
              </p>
            </div>

            <div className='space-y-3'>
              {/* Google Sign-In */}
              <button
                onClick={() => handleOauthSignIn('google')}
                className='btn w-full flex items-center justify-center gap-3'
              >
                <GoogleIcon />
                <span>Continuar con Google</span>
              </button>

              {/* GitHub Sign-In */}
              <button
                onClick={() => handleOauthSignIn('github')}
                className='btn w-full flex items-center justify-center gap-3'
              >
                <GitHubIcon className='fill-current' />
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
      </div>
    </div>
  );
}
