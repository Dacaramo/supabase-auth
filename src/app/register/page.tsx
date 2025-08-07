import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import RegisterForm from '@/components/RegisterForm';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si ya está autenticado, redirigir al dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Crear Cuenta</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Regístrate con tu email y contraseña
          </p>
        </div>

        {searchParams?.message && (
          <div className='alert alert-info'>
            <span>{searchParams.message}</span>
          </div>
        )}

        <RegisterForm />
      </div>
    </div>
  );
}
