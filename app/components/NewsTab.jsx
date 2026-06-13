'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

export default function NewsTab() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // TRT Haber RSS to JSON
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.trthaber.com/xml_mobile.php');
      const data = await res.json();
      
      if (data.status === 'ok') {
        setNews(data.items.slice(0, 15)); // First 15 items
      } else {
        setError('Haberler yüklenirken bir sorun oluştu.');
      }
    } catch (err) {
      setError('Bağlantı hatası.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden border border-[var(--glass-border)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)] opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-color)] to-[var(--accent-color)] tracking-tight">
                Gündem & Haberler
              </h2>
              <p className="text-[var(--text-muted)] mt-2">
                Dünyadan ve Türkiye'den son gelişmeler (TRT Haber)
              </p>
            </div>
            
            <button 
              onClick={fetchNews}
              disabled={loading}
              className="p-3 rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-hover)] transition-all flex items-center justify-center border border-[var(--glass-border)] group"
            >
              <RefreshCw className={`w-5 h-5 text-[var(--accent-color)] ${loading ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <RefreshCw className="w-10 h-10 text-[var(--accent-color)] animate-spin" />
              <p className="text-[var(--text-muted)] animate-pulse">Gündem taranıyor...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item, i) => (
                <a 
                  key={i} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl overflow-hidden hover:border-[var(--accent-color)] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-color)]/10"
                >
                  {item.thumbnail && (
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs font-mono text-[var(--accent-color)] mb-2">
                      {new Date(item.pubDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <h3 className="font-bold text-[var(--text-color)] line-clamp-2 mb-3 group-hover:text-[var(--accent-color)] transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-sm text-[var(--text-muted)] font-medium">
                      Haberi Oku <ExternalLink className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
