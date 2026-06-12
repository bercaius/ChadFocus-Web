'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // Fetch users from admin API
      fetch('/api/admin/users')
        .then(r => r.json())
        .then(data => { setUsers(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading') return <div style={{ padding: 40, color: '#666' }}>Yukleniyor...</div>;
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ color: '#FFD700', fontSize: 20 }}>Admin Paneli</h2>
          <p style={{ color: '#666', fontSize: 12, marginTop: 8 }}>Giris yapman gerekiyor</p>
          <a href="/auth" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: '#FFD700', color: '#000', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Giris Yap</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#FFD700' }}>Admin Panel</h1>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>ChadFocus Kullanici Yonetimi</p>
          </div>
          <button onClick={() => signOut()} style={{ padding: '8px 16px', background: '#FF4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Cikis Yap</button>
        </div>

        <div style={{ background: 'var(--gradient-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Kullanicilar ({users.length})</h3>
          {loading ? (
            <p style={{ color: '#666', fontSize: 12 }}>Yukleniyor...</p>
          ) : users.length === 0 ? (
            <p style={{ color: '#666', fontSize: 12 }}>Henuz kayitli kullanici yok</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Isim</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>E-posta</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{user.id}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-primary)' }}>{user.name}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ fontSize: 9, color: 'var(--text-dim)' }}>ChadFocus Admin Panel v1.0 · 2026</p>
        </div>
      </div>
    </div>
  );
}