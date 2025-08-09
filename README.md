# Parte práctica del curso de Supabase Auth

- URL del proyecto de Supabase + Anon Key de Supabase
- Clientes de Supabase

## Crear cuenta con Email y Contraseña

- Crear cuenta
- Mostrar usuario en el dashboard, su sesión y su identidad
- Código de la página
- Redirect urls en el dashboard
- Mostrar código de callback

> **Explicación de `/api/callback/route.ts`**: Endpoint que actua como el "puente" entre Supabase Auth y tu aplicación. Este endpoint autentica al usuario cuando el usuario es redireccionado a nuestra aplicación tras haberle dado click a alguno de los links que Supabase manda al email (confirmar correo, reset password, magic links).

## Login con Email y contraseña

- Iniciar sesión en otro navegador para ese mismo usuario
- Mostrar cómo se crea otra sesión para ese usuario

## Login con Magic Links

## Login con OTP por SMS

- Configurar Twilio

## Login con OAuth Providers

- Configurar Google
- Configurar GitHub

## Editar Perfil

## Cambiar Contraseña

## Cerrar Sesión

## Borrar Cuenta

## Olvidé mi contraseña
