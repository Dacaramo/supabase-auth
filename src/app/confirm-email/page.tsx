import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: {
    token_hash?: string;
    type?: string;
    next?: string;
    message?: string;
  };
}) {
  const supabase = await createClient();
  let confirmationResult = null;
  let error = null;

  // Si hay token_hash y type, intentar verificar
  if (searchParams.token_hash && searchParams.type) {
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: searchParams.token_hash,
        type: searchParams.type as any,
      });

      if (verifyError) {
        error = verifyError.message;
      } else {
        confirmationResult = 'success';
        // Redirigir después de confirmación exitosa
        const nextUrl = searchParams.next || '/dashboard';
        redirect(nextUrl);
      }
    } catch (err) {
      error = 'Error inesperado durante la confirmación';
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Confirmación de Email</h2>
        </div>

        {/* Error de confirmación */}
        {error && (
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body text-center'>
              <div className='text-6xl mb-4'>❌</div>
              <h3 className='text-lg font-semibold text-error'>
                Error de Confirmación
              </h3>
              <p className='text-sm text-base-content/60 mb-4'>{error}</p>
              <div className='space-y-2'>
                <p className='text-xs text-base-content/50'>Posibles causas:</p>
                <ul className='text-xs text-left space-y-1'>
                  <li>• El enlace ha expirado</li>
                  <li>• El enlace ya fue usado</li>
                  <li>• El enlace está dañado</li>
                </ul>
              </div>
              <div className='flex flex-col gap-2 mt-6'>
                <Link
                  href='/register'
                  className='btn btn-primary'
                >
                  Registrarse de Nuevo
                </Link>
                <Link
                  href='/login'
                  className='btn btn-outline'
                >
                  Ir al Login
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje personalizado */}
        {searchParams?.message && !error && (
          <div className='alert alert-info'>
            <span>{searchParams.message}</span>
          </div>
        )}

        {/* Página de espera de confirmación */}
        {!searchParams.token_hash && !error && (
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body text-center'>
              <div className='text-6xl mb-4'>📧</div>
              <h3 className='text-lg font-semibold'>Revisa tu Email</h3>
              <p className='text-sm text-base-content/60 mb-4'>
                Te hemos enviado un enlace de confirmación. Haz clic en el
                enlace para verificar tu cuenta.
              </p>

              <div className='bg-base-200 p-4 rounded-lg mb-4'>
                <p className='text-xs text-base-content/70'>
                  💡 <strong>Consejos:</strong>
                </p>
                <ul className='text-xs text-left space-y-1 mt-2'>
                  <li>• Revisa tu carpeta de spam</li>
                  <li>• El enlace expira en 24 horas</li>
                  <li>• Solo puedes usar el enlace una vez</li>
                </ul>
              </div>

              <div className='flex flex-col gap-2'>
                <Link
                  href='/register'
                  className='btn btn-primary'
                >
                  Registrarse de Nuevo
                </Link>
                <Link
                  href='/login'
                  className='btn btn-outline'
                >
                  Ir al Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
