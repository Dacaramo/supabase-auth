'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/client';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        if (user.user_metadata) {
          setFirstName(user.user_metadata.first_name || '');
          setLastName(user.user_metadata.last_name || '');
        }
      }
    };

    getUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (error) {
      toast.error(
        'Error al actualizar los datos del usuario: ' + error.message
      );
      return;
    }

    toast.success('Datos actualizados exitosamente');
  };

  return (
    <>
      {user && (
        <div className='min-h-screen'>
          <div className='container mx-auto px-4 py-8'>
            <div className='max-w-4xl mx-auto'>
              <div className='mb-6'>
                <h1 className='text-3xl font-bold'>Mi Perfil</h1>
              </div>

              {/* Formulario para cambiar datos del usuario */}
              <div className='space-y-6'>
                <div className='card bg-base-100 shadow-xl'>
                  <div className='card-body'>
                    <h2 className='card-title'>Cambia tus datos personales</h2>
                    <p className='text-sm text-base-content/60 mb-4'>
                      Estos datos se almacenan en el campo user_metadata del
                      objeto User
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
                          />
                        </div>
                      </div>

                      <div className='form-control mt-6'>
                        <button
                          type='submit'
                          className='btn btn-primary'
                        >
                          Actualizar Datos
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
