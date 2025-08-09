# Parte práctica del curso de Supabase Auth

- URL del proyecto de Supabase + Anon Key de Supabase
- Clientes de Supabase
- Middleware

## Crear cuenta con Email y Contraseña

- Solo mostrar UI, sin probarla, luego explicar código
- Redirect urls en el dashboard
- Mostrar código de callback
- Probar UI
- Mostrar usuario en el dashboard, su sesión y su identidad

> **Explicación de `/api/callback/route.ts`**: Endpoint que actua como el "puente" entre Supabase Auth y tu aplicación. Este endpoint autentica al usuario cuando el usuario es redireccionado a nuestra aplicación tras haberle dado click a alguno de los links que Supabase manda al email (confirmar correo, reset password, magic links).

> **Explicación de `middleware.ts`**: Se ejecuta en cada request para actualizar automáticamente las
> sesiones de usuario mediante cookies

## Login con Email y contraseña

- Iniciar sesión en otro navegador para ese mismo usuario
- Mostrar cómo se crea otra sesión para ese mismo usuario en el dashboard

## Login con Magic Links

## Login con OTP por SMS

- Configurar Twilio

## Login con OAuth Providers

- Configurar Google
- Configurar GitHub

## Editar Perfil

## Cambiar Contraseña

## Cerrar Sesión

## Borrar Cuenta (MFA)

- Configurar MFA (/mfa-config)
- Challenge MFA (/mfa-challenge)

## Olvidé mi contraseña

## RBAC (Role Based Access Control / Control de Acceso Basado en Roles)

## Plantillas de Email

## Explicar cada pestaña del apartado "Authentication" en el dashboard
