import React, { useState, useEffect } from 'react';

interface DiagnosticData {
  ip: string;
  isp: string;
  location: string;
  connectionType: string;
  downlink: string;
  rtt: string;
  userAgent: string;
  platform: string;
  cores: number;
  memory: string;
}

interface Suggestion {
  type: 'warning' | 'info' | 'success';
  title: string;
  text: string;
  icon: string;
}

export const SecurityDiagnostic: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (isOpen) {
      runDiagnostic();
    }
  }, [isOpen]);

  const generateSuggestions = (diag: DiagnosticData) => {
    const list: Suggestion[] = [];
    const isSecure = window.location.protocol === 'https:';

    if (diag.ip !== 'Detection Blocked' && diag.ip !== 'Unavailable') {
      list.push({
        type: 'warning',
        title: 'IP Address Exposed',
        text: 'Your public IP is visible. Use a VPN to mask your location.',
        icon: 'fa-user-secret'
      });
    } else {
      list.push({
        type: 'success',
        title: 'Identity Masked',
        text: 'Your network identity is obscured from trackers.',
        icon: 'fa-mask'
      });
    }

    if (diag.cores > 0) {
      list.push({
        type: 'info',
        title: 'Hardware Profile',
        text: `${diag.cores} CPU cores detectable via fingerprinting.`,
        icon: 'fa-fingerprint'
      });
    }

    if (!isSecure) {
      list.push({
        type: 'warning',
        title: 'Unencrypted Path',
        text: 'Browsing over insecure HTTP. Use HTTPS everywhere.',
        icon: 'fa-triangle-exclamation'
      });
    }

    setSuggestions(list);
  };

  const runDiagnostic = async () => {
    setLoading(true);
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const cores = navigator.hardwareConcurrency || 0;
    const memory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Standard';
    const userAgent = navigator.userAgent.split(' ').slice(-1)[0];

    let networkInfo = {
      ip: 'Blocked',
      isp: 'VPN/Firewall Active',
      location: 'Restricted'
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const ipRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        networkInfo = {
          ip: ipData.ip || 'Unavailable',
          isp: ipData.org || 'Gateway',
          location: ipData.city && ipData.country_name ? `${ipData.city}, ${ipData.country_name}` : 'Unknown'
        };
      }
    } catch (err) {}

    const diagResult = {
      ...networkInfo,
      connectionType: conn?.effectiveType?.toUpperCase() || 'Direct',
      downlink: conn?.downlink ? `${conn.downlink} Mbps` : 'N/A',
      rtt: conn?.rtt ? `${conn.rtt} ms` : 'N/A',
      userAgent,
      platform: navigator.platform,
      cores,
      memory
    };

    setData(diagResult);
    generateSuggestions(diagResult);
    setTimeout(() => setLoading(false), 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl soft-glass rounded-[1.5rem] md:rounded-[2.5rem] border border-[var(--border)] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 md:p-6 border-b border-[var(--border)] flex justify-between items-center bg-black/5 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <i className="fas fa-radar text-sm"></i>
            </div>
            <div>
              <h3 className="font-bold text-base md:text-xl text-[var(--text-main)] uppercase tracking-tight">System Audit</h3>
              <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Scanning Environment...</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"><i className="fas fa-times text-xs"></i></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-8">
          {loading ? (
            <div className="h-48 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Syncing Nodes</p>
            </div>
          ) : (
            <div className="animate-slide-up space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <h4 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Network Intel</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <DiagnosticItem label="Public Endpoint" value={data?.ip || ''} sub={data?.isp || ''} />
                    <DiagnosticItem label="Spatial Node" value={data?.location || ''} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Hardware Logic</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <DiagnosticItem label="Compute Unit" value={`${data?.cores} cores`} sub={data?.memory} color="text-indigo-500" />
                    <DiagnosticItem label="Interface" value={data?.connectionType || ''} sub={data?.downlink} color="text-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((s, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex gap-4 items-start ${s.type === 'warning' ? 'bg-red-500/5 border-red-500/10' : s.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-indigo-500/5 border-indigo-500/10'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${s.type === 'warning' ? 'text-red-500 border-red-500/10' : s.type === 'success' ? 'text-emerald-500 border-emerald-500/10' : 'text-indigo-500 border-indigo-500/10'}`}><i className={`fas ${s.icon} text-xs`}></i></div>
                      <div>
                        <h5 className="font-bold text-[9px] uppercase tracking-widest mb-1">{s.title}</h5>
                        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 md:p-8 bg-black/5 dark:bg-white/[0.02] border-t border-[var(--border)] flex justify-end">
          <button onClick={onClose} className="px-8 py-3 guardian-gradient text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg">Acknowledge</button>
        </div>
      </div>
    </div>
  );
};

const DiagnosticItem = ({ label, value, sub, color = "text-emerald-500" }: any) => (
  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border)] group">
    <div className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-0.5">{label}</div>
    <div className={`text-sm font-black ${color} truncate`}>{value}</div>
    {sub && <div className="text-[8px] text-[var(--text-muted)] mt-0.5 opacity-60 truncate">{sub}</div>}
  </div>
);