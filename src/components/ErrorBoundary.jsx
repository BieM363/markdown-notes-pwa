import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Terjadi Kesalahan Aplikasi</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.toString() || "Ada kesalahan pada rendering UI."}
            </p>
            {this.state.errorInfo && (
              <pre className="text-[10px] bg-slate-950 p-3 rounded-lg text-rose-300 text-left overflow-x-auto max-h-40 border border-slate-800 font-mono">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Storage & Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
