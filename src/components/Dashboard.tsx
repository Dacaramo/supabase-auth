'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User, Session } from '@supabase/supabase-js';
import { formatDate, parseJwt } from '@/utils/strings';

interface Props {
  user: User;
  session: Session;
}

export default function Dashboard({ user, session }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        return;
      }

      router.refresh();
      router.push('/login?message=Has cerrado sesión exitosamente');
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log(
    '@@@@@parseJwt(session?.access_token)',
    parseJwt(session?.access_token)
  );
  console.log('@@@@@session', session);

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {/* User Info Card */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>👤 Información del Usuario</h2>

          <div className='space-y-3'>
            <div>
              <span className='font-semibold text-sm'>Email:</span>
              <div className='flex flex-row gap-2'>
                <p className='text-sm break-all w-fit'>{user.email || 'N/A'}</p>
                <p className='text-sm'>
                  {user.email_confirmed_at ? (
                    <span className='badge badge-success'>✓ Confirmado</span>
                  ) : (
                    <span className='badge badge-warning'>⚠ Sin confirmar</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <span className='font-semibold text-sm'>Teléfono:</span>
              <div className='flex flex-row gap-2'>
                <p className='text-sm break-all'>{user.phone || 'N/A'}</p>
                <p className='text-sm'>
                  {user.phone_confirmed_at ? (
                    <span className='badge badge-success'>✓ Confirmado</span>
                  ) : (
                    <span className='badge badge-warning'>⚠ Sin confirmar</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <span className='font-semibold text-sm'>ID:</span>
              <p className='text-xs font-mono break-all'>{user.id}</p>
            </div>

            <div>
              <span className='font-semibold text-sm'>Último acceso:</span>
              <p className='text-xs'>
                {user.last_sign_in_at
                  ? formatDate(user.last_sign_in_at)
                  : 'N/A'}
              </p>
            </div>

            {user.user_metadata &&
              Object.keys(user.user_metadata).length > 0 && (
                <div>
                  <span className='font-semibold text-sm'>
                    Metadatos del usuario:
                  </span>
                  <details className='text-xs'>
                    <summary className='cursor-pointer'>Ver detalles</summary>
                    <pre className='bg-base-200 p-2 rounded mt-2 overflow-auto'>
                      {JSON.stringify(user.user_metadata, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

            <div>
              <span className='font-semibold text-sm'>Identidades:</span>
              <ul className='list-disc ml-5'>
                {user.identities?.map((identity) => {
                  return <li key={identity.id}>{identity.provider}</li>;
                })}
              </ul>
            </div>
          </div>

          <div className='card-actions justify-end mt-4'>
            <Link
              href='/profile'
              className='btn btn-primary btn-sm'
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Session Info Card */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>🔐 Información de Sesión</h2>

          <div className='space-y-3'>
            <div>
              <span className='font-semibold text-sm'>Expira:</span>
              <p className='text-xs'>
                {session.expires_at
                  ? formatDate(session.expires_at * 1000)
                  : 'N/A'}
              </p>
            </div>

            <div>
              <span className='font-semibold text-sm'>Duración:</span>
              <p className='text-xs'>
                {session.expires_in ? `${session.expires_in} segundos` : 'N/A'}
              </p>
            </div>
          </div>

          <div className='card-actions justify-end mt-4'>
            <button
              onClick={handleSignOut}
              className='btn btn-error btn-sm'
              disabled={loading}
            >
              {loading ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : (
                'Cerrar Sesión'
              )}
            </button>
          </div>

          {}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>⚡ Acciones Rápidas</h2>

          <div className='space-y-3'>
            <Link
              href='/profile'
              className='btn btn-outline w-full justify-start'
            >
              👤 Editar Perfil
            </Link>

            <Link
              href='/update-password'
              className='btn btn-outline w-full justify-start'
            >
              🔒 Cambiar Contraseña
            </Link>

            <Link
              href='/mfa'
              className='btn btn-outline w-full justify-start'
            >
              🛡️ Configurar MFA
            </Link>

            <div className='divider my-2'></div>

            <Link
              href='/'
              className='btn btn-ghost w-full justify-start'
            >
              🏠 Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
