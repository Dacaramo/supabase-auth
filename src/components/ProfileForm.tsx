'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User;
}

export default function ProfileForm({ user }: Props) {
  const [email, setEmail] = useState(user.email || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Cargar metadata del usuario al montar el componente
  useEffect(() => {
    if (user.user_metadata) {
      setFirstName(user.user_metadata.first_name || '');
      setLastName(user.user_metadata.last_name || '');
    }
  }, [user.user_metadata]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Perfil actualizado exitosamente');
      router.refresh();
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (email === user.email) {
      setError('El nuevo email debe ser diferente al actual');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(
        'Se ha enviado un email de confirmación al nuevo email. Revisa tu bandeja de entrada.'
      );
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* User Metadata Card */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>👤 Información Personal</h2>
          <p className='text-sm text-base-content/60 mb-4'>
            Esta información se almacena en el user_metadata de tu cuenta
          </p>

          <form
            onSubmit={handleUpdateProfile}
            className='space-y-4'
          >
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Nombre</span>
                </label>
                <input
                  type='text'
                  placeholder='Tu nombre'
                  className='input input-bordered w-full'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Apellido</span>
                </label>
                <input
                  type='text'
                  placeholder='Tu apellido'
                  className='input input-bordered w-full'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className='form-control mt-6'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={loading}
              >
                {loading ? (
                  <span className='loading loading-spinner loading-sm'></span>
                ) : (
                  'Actualizar Información'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Update Card */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>📧 Cambiar Email</h2>
          <p className='text-sm text-base-content/60 mb-4'>
            Al cambiar tu email, recibirás un enlace de confirmación en el nuevo
            email
          </p>

          <form
            onSubmit={handleUpdateEmail}
            className='space-y-4'
          >
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email Actual</span>
              </label>
              <input
                type='email'
                className='input input-bordered w-full'
                value={user.email || ''}
                disabled
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Nuevo Email</span>
              </label>
              <input
                type='email'
                placeholder='nuevo@email.com'
                className='input input-bordered w-full'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className='form-control mt-6'>
              <button
                type='submit'
                className='btn btn-warning'
                disabled={loading || email === user.email}
              >
                {loading ? (
                  <span className='loading loading-spinner loading-sm'></span>
                ) : (
                  'Cambiar Email'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className='alert alert-error'>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className='alert alert-success'>
          <span>{success}</span>
        </div>
      )}

      {/* User Data Viewer */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>🔍 Datos del Usuario (Solo Lectura)</h2>
          <p className='text-sm text-base-content/60 mb-4'>
            Información completa del objeto User de Supabase
          </p>

          <div className='bg-base-200 p-4 rounded-lg'>
            <pre className='text-xs overflow-auto max-h-96'>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex gap-4 justify-center'>
        <Link
          href='/dashboard'
          className='btn btn-outline'
        >
          ← Volver al Dashboard
        </Link>
        <Link
          href='/update-password'
          className='btn btn-primary'
        >
          Cambiar Contraseña →
        </Link>
      </div>
    </div>
  );
}
