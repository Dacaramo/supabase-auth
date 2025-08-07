'use client';

import { useState } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard?message=Contraseña actualizada exitosamente');
      }, 2000);
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body text-center'>
          <div className='text-4xl mb-4'>✅</div>
          <h3 className='text-lg font-semibold text-success'>
            ¡Contraseña actualizada!
          </h3>
          <p className='text-sm text-base-content/60'>
            Tu contraseña ha sido cambiada exitosamente.
          </p>
          <p className='text-xs text-base-content/50 mt-2'>
            Serás redirigido al dashboard automáticamente...
          </p>
          <Link
            href='/dashboard'
            className='btn btn-primary mt-4'
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
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
              disabled={loading}
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
              disabled={loading}
              autoComplete='off'
            />
          </div>

          {error && (
            <div className='alert alert-error'>
              <span className='text-sm'>{error}</span>
            </div>
          )}

          <div className='form-control mt-6'>
            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={loading}
            >
              {loading ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </div>
        </form>

        <div className='divider'>O</div>

        <div className='text-center'>
          <p className='text-sm'>
            <Link
              href='/dashboard'
              className='link link-primary'
            >
              Cancelar y volver al Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
