import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { checkHealth } from '../api/client';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export const HealthCheckPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await checkHealth();
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setHealthData(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Cannot reach Express backend on port 5000'
      );
      setHealthData(null);
      setLatency(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const isServerHealthy = healthData?.status === 'healthy';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-elevation relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 1 Foundation Shell
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            SpendWise Full-Stack Architecture Shell
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            The Express REST API, Mongoose database connector, and React design system are live and connected.
            Inspect real-time telemetry, test API latency, and review our design system below.
          </p>
        </div>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* API Gateway Card */}
        <Card hoverEffect={true}>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                API Backend
              </span>
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900">Port 5000</span>
                <Badge variant={isServerHealthy ? 'success' : 'danger'} dot={true}>
                  {loading ? 'Checking...' : isServerHealthy ? 'Operational' : 'Unavailable'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">Express.js 4.21 with CORS enabled</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Latency:</span>
              <span className="font-mono font-semibold text-brand-600">
                {latency !== null ? `${latency} ms` : '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Database Status Card */}
        <Card hoverEffect={true}>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Database Engine
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900">MongoDB</span>
                <Badge
                  variant={healthData?.services?.database?.status === 'connected' ? 'success' : 'warning'}
                  dot={true}
                >
                  {healthData?.services?.database?.status || 'Waiting'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {healthData?.services?.database?.name || 'expensetracker'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Ready State:</span>
              <span className="font-mono font-semibold text-emerald-600">
                {healthData?.services?.database?.readyState === 1 ? '1 (Connected)' : '0 (Disconnected)'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Server Runtime & Uptime Card */}
        <Card hoverEffect={true}>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System Runtime
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {healthData?.uptime ? `${healthData.uptime}s` : '0s'}
                </span>
                <Badge variant="neutral">Uptime</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Node.js v25.6.0 ({healthData?.environment || 'development'})
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Last Checked:</span>
              <span className="font-mono text-slate-700">{lastChecked || 'Not yet'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Health Details & Diagnostic Actions */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Live Health Diagnostic & Endpoint Response</CardTitle>
            <CardDescription>
              Direct payload returned from GET <code className="text-brand-600 font-mono">/api/health</code>
            </CardDescription>
          </div>
          <Button
            variant="primary"
            size="sm"
            isLoading={loading}
            icon={RefreshCw}
            onClick={fetchStatus}
          >
            Ping Backend API
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Backend Communication Error</h4>
                <p className="text-xs text-rose-700 mt-1">{error}</p>
                <p className="text-xs text-rose-600 mt-2 font-mono">
                  Make sure Express is running via `npm run dev:server` on port 5000.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
              <pre>{JSON.stringify(healthData, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Design System Preview Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Design System Token Preview</CardTitle>
            <CardDescription>
              Pre-defined design system buttons, badges, and components for SpendWise
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons row */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Reusable Buttons
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="success">Positive Income</Button>
              <Button variant="danger">Expense Action</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" isLoading={true}>Loading State</Button>
            </div>
          </div>

          {/* Badges row */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Status Badges
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success" dot={true}>Connected / Healthy</Badge>
              <Badge variant="info" dot={true}>Processing API</Badge>
              <Badge variant="warning" dot={true}>Connecting...</Badge>
              <Badge variant="danger" dot={true}>Failed / Degraded</Badge>
              <Badge variant="neutral">Draft Status</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthCheckPage;
