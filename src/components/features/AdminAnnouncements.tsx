import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Announcement } from '@/types/community';
import AnnouncementEditor from '@/components/forms/AnnouncementEditor';
import type { PublicationValues } from '@/lib/siteValidation';
interface Props { announcements: Announcement[]; }
const FILTERS = [{ id: 'all', label: 'All publications' }, { id: 'news', label: 'News' }, { id: 'announcement', label: 'Announcements' }, { id: 'event', label: 'Events' }];
export default function AdminAnnouncements({ announcements }: Props) {
  const [editing, setEditing] = useState<Announcement | true | null>(null);
  const [filter, setFilter] = useState('all');
  const visible = announcements.filter(item => filter === 'all' || item.kind === filter).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const initialKind: PublicationValues['kind'] = filter === 'news' ? 'news' : filter === 'event' ? 'event' : 'announcement';
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between gap-6"><div><span className="eyebrow text-primary">PUBLISH FROM YOUR CORNER</span><h1 className="text-4xl mt-4 font-semibold">News & updates</h1><p className="text-muted-foreground mt-3">Create stories, publish announcements, or share verified event details.</p></div>{!editing && <button className="btn-primary self-end" onClick={() => setEditing(true)}><Plus size={18} />{filter === 'news' ? 'Add news article' : 'New publication'}</button>}</div>
    {editing && <AnnouncementEditor key={editing === true ? 'new' : editing.id} announcement={editing === true ? undefined : editing} initialKind={initialKind} close={() => setEditing(null)} />}
    <nav className="flex flex-wrap gap-2" aria-label="Publication filters">{FILTERS.map(item => <button key={item.id} className={`btn ${filter === item.id ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:opacity-80'}`} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{item.label}</button>)}</nav>
    <div className="grid xl:grid-cols-2 gap-6">{visible.map(item => <article className="panel" key={item.id}>
      <div className="flex items-center justify-between gap-4"><span className="eyebrow text-accent">{item.kind === 'news' ? 'News article' : item.kind === 'event' ? 'Event' : 'Announcement'}</span><span className="text-sm text-muted-foreground">{item.published ? 'Published' : 'Private draft'}</span></div>
      {item.image_url && <img src={item.image_url} alt={item.title} className="w-full aspect-[21/9] object-cover rounded-xl mt-5" loading="lazy" />}
      <h2 className="text-2xl mt-4 font-semibold">{item.title}</h2><p className="text-muted-foreground mt-3 whitespace-pre-wrap line-clamp-4">{item.content}</p>
      {item.event_date && <p className="text-sm mt-3">{new Date(item.event_date).toLocaleString()}</p>}<button onClick={() => setEditing(item)} className="btn-secondary mt-5">Edit publication</button>
    </article>)}</div>
    {!visible.length && <div className="panel text-muted-foreground">No matching publications yet. Add a publication to get started.</div>}
  </div>;
}
