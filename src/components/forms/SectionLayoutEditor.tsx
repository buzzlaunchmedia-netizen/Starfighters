import { ArrowDown, ArrowUp } from 'lucide-react';
import { SECTION_LABELS } from '@/constants/site';
import type { SiteSection } from '@/types/site';
interface Props { sections: SiteSection[]; onChange: (sections: SiteSection[]) => void; disabled: boolean; }
export default function SectionLayoutEditor({ sections, onChange, disabled }: Props) {
  const move = (index: number, direction: number) => {
    const next = [...sections];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange(next);
  };
  return <section className="border border-border rounded-xl p-6">
    <h2 className="text-xl font-semibold">Homepage sections</h2><p className="text-muted-foreground mt-2 mb-5">Show, hide, and reorder sections. Hero and footer stay in place; hiding a section does not delete its records.</p>
    <ol className="space-y-3">{sections.map((section, index) => <li key={section.id} className="flex items-center justify-between gap-4 rounded-xl bg-secondary p-3">
      <label className="flex items-center gap-3 min-h-11 !mb-0"><input type="checkbox" checked={section.enabled} disabled={disabled} onChange={event => onChange(sections.map(item => item.id === section.id ? { ...item, enabled: event.target.checked } : item))} />{SECTION_LABELS[section.id]}</label>
      <div className="flex"><button type="button" className="p-3 hover:text-accent" disabled={disabled || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${SECTION_LABELS[section.id]} up`}><ArrowUp size={20} /></button>
        <button type="button" className="p-3 hover:text-accent" disabled={disabled || index === sections.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${SECTION_LABELS[section.id]} down`}><ArrowDown size={20} /></button></div>
    </li>)}</ol>
  </section>;
}
