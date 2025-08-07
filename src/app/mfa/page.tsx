import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import MfaSetup from '@/components/MfaSetup';

export default async function MfaPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Si no está autenticado, redirigir al login
  if (error || !user) {
    redirect('/login?message=Debes iniciar sesión para configurar MFA');
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold'>Multi-Factor Authentication</h1>
            <p className='text-base-content/60'>
              Configura una capa adicional de seguridad para tu cuenta
            </p>
          </div>

          {searchParams?.message && (
            <div className='alert alert-success mb-6'>
              <span>{searchParams.message}</span>
            </div>
          )}

          <MfaSetup />
        </div>
      </div>
    </div>
  );
}
