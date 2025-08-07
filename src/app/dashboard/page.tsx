import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import Dashboard from '@/components/Dashboard';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // Si no está autenticado, redirigir al login
  if (userError || sessionError || !user || !session) {
    redirect('/login?message=Debes iniciar sesión para acceder al dashboard');
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <p className='text-base-content/60'>Bienvenido, {user.email}</p>
        </div>

        {searchParams?.message && (
          <div className='alert alert-success mb-6'>
            <span>{searchParams.message}</span>
          </div>
        )}

        <Dashboard
          user={user}
          session={session}
        />
      </div>
    </div>
  );
}
