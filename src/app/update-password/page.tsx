'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error('Error al actualizar la contraseña: ' + error.message);
      return;
    }

    router.push('/dashboard');
    toast.success('Contraseña actualizada exitosamente');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold'>Actualizar Contraseña</h2>
          <p className='mt-2 text-sm text-base-content/60'>
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Formulario que solicita la nueva contraseña */}
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Nueva Contraseña</span>
                </label>
                <input
                  type='password'
                  placeholder='Mínimo 6 caracteres'
                  className='input input-bordered w-full'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete='off'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Confirmar Nueva Contraseña</span>
                </label>
                <input
                  type='password'
                  placeholder='Repite tu nueva contraseña'
                  className='input input-bordered w-full'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete='off'
                />
              </div>

              <div className='form-control mt-6'>
                <button
                  type='submit'
                  className='btn btn-primary w-full'
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
