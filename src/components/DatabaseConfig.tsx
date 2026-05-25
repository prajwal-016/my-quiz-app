import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, X, Save, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getSupabaseConfig, refreshSupabaseClient } from '../lib/supabase';

interface DatabaseConfigProps {
  onConfigChanged: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseConfig: React.FC<DatabaseConfigProps> = ({ onConfigChanged, isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [config, setConfig] = useState(getSupabaseConfig());
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const activeConfig = getSupabaseConfig();
    setConfig(activeConfig);
    setUrl(activeConfig.isLocalConfigured ? activeConfig.url : '');
    setAnonKey(activeConfig.isLocalConfigured ? activeConfig.anonKey : '');
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      try {
        if (url.trim() && anonKey.trim()) {
          localStorage.setItem('supabase_url', url.trim());
          localStorage.setItem('supabase_anon_key', anonKey.trim());
          setAlertMsg({ type: 'success', text: 'Supabase credentials saved successfully!' });
        } else {
          setAlertMsg({ type: 'error', text: 'Please fill in both fields.' });
          setLoading(false);
          return;
        }

        // Re-initialize client
        refreshSupabaseClient();
        setConfig(getSupabaseConfig());
        onConfigChanged();
      } catch (err) {
        setAlertMsg({ type: 'error', text: 'Failed to save configuration.' });
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleReset = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('supabase_url');
      localStorage.removeItem('supabase_anon_key');
      setUrl('');
      setAnonKey('');
      
      refreshSupabaseClient();
      setConfig(getSupabaseConfig());
      onConfigChanged();
      
      setAlertMsg({ type: 'success', text: 'Reset to environment defaults.' });
      setLoading(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end animate-fade-in select-none">
      {/* Sliding Drawer Container */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in relative border-l border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Database className="text-javaBlue" size={20} />
            <h3 className="font-bold text-slate-800 text-base md:text-lg">Database Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition-all focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-left">
          
          {/* Status Display Card */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
            config.isConnected
              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-extrabold tracking-wider opacity-60">Status</span>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                config.isConnected ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {config.isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                {config.isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
            <div className="font-bold text-sm md:text-base flex items-center gap-1.5 mt-1">
              {config.isConnected ? (
                <>
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span>Real-time Supabase Active</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={18} className="text-amber-600" />
                  <span>Mock Mode (Local Fallback)</span>
                </>
              )}
            </div>
            <p className="text-xs opacity-75 leading-relaxed mt-1">
              {config.isConnected
                ? 'The application is querying your live database. Question updates and results are processed in real-time!'
                : 'Using pre-seeded local full stack Java questions. Connect your own Supabase instance by entering your credentials below.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Supabase URL</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-javaBlue text-slate-800 font-mono shadow-sm"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anon API Key</label>
              <input
                type="password"
                required
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-javaBlue text-slate-800 font-mono shadow-sm"
              />
            </div>

            {alertMsg && (
              <div className={`p-3.5 rounded-lg text-xs font-semibold animate-fade-in ${
                alertMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {alertMsg.text}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-javaBlue hover:bg-javaBlue-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                Save Config
              </button>

              {config.isLocalConfigured && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {/* Database Setup Guide */}
          <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-2">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">How to setup your Supabase DB?</h4>
            <ol className="text-xs text-slate-500 list-decimal pl-4 flex flex-col gap-1.5 leading-relaxed">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-javaBlue underline font-semibold">supabase.com</a>.</li>
              <li>Go to the <strong>SQL Editor</strong> tab in your Supabase dashboard.</li>
              <li>Execute the SQL queries in the <strong>supabase_schema.sql</strong> file (located in the project root) to create tables and pre-load all the categories/questions.</li>
              <li>Copy your API credentials from <strong>Project Settings &gt; API</strong> and enter them here!</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};
