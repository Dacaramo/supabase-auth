import { createClient } from '@/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const token_hash = searchParams.get('token_hash');
  // Si hay un parámetro 'next', lo usamos como URL de redirección
  const next = searchParams.get('next') ?? '/dashboard';

  const supabase = await createClient();

  // Método 1: Intercambio de código por sesión (PKCE flow)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      // Si es un reset de contraseña, redirigir a update-password
      const redirectPath = type === 'recovery' ? '/update-password' : next;

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // Método 2: Verificación directa con token_hash (confirmación de email)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      // Error en verificación - redirigir con mensaje de error
      return NextResponse.redirect(
        `${origin}/confirm-email?token_hash=${token_hash}&type=${type}&message=${encodeURIComponent(
          error.message
        )}`
      );
    }
  }

  // Si hay error o no hay código/token, redirigir a página de error
  return NextResponse.redirect(
    `${origin}/error?message=No se pudo procesar la solicitud`
  );
}
