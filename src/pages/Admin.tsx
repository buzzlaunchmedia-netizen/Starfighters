import { Link, useSearchParams } from 'react-router-dom';
import { useAdminData } from '@/hooks/useAdmin';
import { usePinAdminSession } from '@/hooks/usePinAdminSession';
import Brand from '@/components/layout/Brand';
import AdminUnlock from '@/components/forms/AdminUnlock';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminOverview from '@/components/features/AdminOverview';
import AdminRegistrations from '@/components/features/AdminRegistrations';
import AdminPolls from '@/components/features/AdminPolls';
import AdminAnnouncements from '@/components/features/AdminAnnouncements';
import AdminSettings from '@/components/features/AdminSettings';
import AdminReports from '@/components/features/AdminReports';
import AdminAudit from '@/components/features/AdminAudit';
export default function Admin() {
  const { unlocked, busy, unlock, lock, logout } = usePinAdminSession();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const { data, isLoading, error, refetch } = useAdminData(unlocked);
  if (!unlocked) return <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 py-16">
    <Brand /><AdminUnlock onUnlock={unlock} /><Link to="/" className="btn-secondary">Back to public site</Link>
  </main>;
  return <div className="lg:flex">
    <AdminSidebar tab={tab} setTab={value => setParams({ tab: value })} logout={logout} busy={busy} />
    <main className="flex-1 min-w-0 p-6 md:p-10">
      {isLoading ? <p className="p-8">Loading secure community data…</p> : error ? <section className="panel">
        <h1 className="text-2xl font-semibold">Administrator access unavailable</h1><p className="text-muted-foreground mt-4">{error.message}</p>
        <div className="flex flex-wrap gap-3 mt-6"><button className="btn-secondary" onClick={() => refetch()}>Retry</button><button className="btn-secondary" onClick={lock}>Enter PIN again</button></div>
      </section> : data ? <>
        {tab === 'overview' && <AdminOverview data={data} />}
        {tab === 'registrations' && <AdminRegistrations members={data.members} />}
        {tab === 'polls' && <AdminPolls data={data} />}
        {tab === 'announcements' && <AdminAnnouncements announcements={data.announcements} />}
        {tab === 'settings' && <AdminSettings settings={data.settings} />}
        {tab === 'reports' && <AdminReports data={data} />}
        {tab === 'audit' && <AdminAudit entries={data.auditLog} />}
      </> : null}
    </main>
  </div>;
}
