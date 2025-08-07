import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import UpdatePasswordForm from '@/components/UpdatePasswordForm';

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no está autenticado, redirigir al login
  if (!user) {
    redirect('/login?message=Debes iniciar sesión para cambiar tu contraseña');
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Actualizar Contraseña</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Ingresa tu nueva contraseña
          </p>
        </div>

        {searchParams?.message && (
          <div className='alert alert-info'>
            <span>{searchParams.message}</span>
          </div>
        )}

        <UpdatePasswordForm />
      </div>
    </div>
  );
}
