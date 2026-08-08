import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, CheckCircle2 } from 'lucide-react';

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Alert Toast */}
      {isOffline && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs flex items-center justify-between font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Anda sedang dalam mode <strong>Offline</strong>. Aplikasi & catatan Anda tetap 100% dapat diakses.</span>
          </div>
          <span className="bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            IndexedDB Active
          </span>
        </div>
      )}

      {/* PWA Install Banner Prompt */}
      {showBanner && (
        <div className="bg-gradient-to-r from-indigo-900/90 to-slate-900/90 border-b border-indigo-500/30 text-white px-4 py-2.5 flex items-center justify-between shadow-lg backdrop-blur-md animate-slideDown">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 rounded-lg text-indigo-400">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                Install ProjectNotes App
                <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">PWA</span>
              </p>
              <p className="text-xs text-slate-300 hidden sm:block">
                Dapatkan akses instan dari Desktop / HP tanpa perlu koneksi internet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Install Sekarang
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="Tutup banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
