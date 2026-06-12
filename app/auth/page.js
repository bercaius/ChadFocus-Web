'use client';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 420, padding: 40, background: '#111111', border: '1px solid rgba(255, 215, 0, 0.18)', borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 80px rgba(0,0,0,0.45)' }}>
        <div style={{ marginBottom: 20, color: '#FFD700', fontSize: 42, fontWeight: 900 }}>ChadFocus</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Kurumsal disiplin, hızlı erişim.</h1>
        <p style={{ fontSize: 14, color: '#b8b8b8', marginBottom: 32, lineHeight: 1.7 }}>
          Kalıcı alışkanlık yönetimi ve kullanıcı erişimi tek noktada. Google hesabınızla güvenli bir şekilde giriş yapın.
        </p>
        <button type="button" onClick={() => signIn('google', { callbackUrl: window.location.origin })} style={{ width: '100%', padding: 16, borderRadius: 14, background: '#FFD700', color: '#000', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
          Google ile Giriş Yap
        </button>
        <p style={{ fontSize: 11, color: '#757575', marginTop: 24, lineHeight: 1.6 }}>
          Bu sayfa canlı bir siteye yönlendirme için tasarlandı. Giriş sonrası yönlendirme mevcut alan adınıza göre çalışacaktır.
        </p>
      </div>
    </div>
  );
}