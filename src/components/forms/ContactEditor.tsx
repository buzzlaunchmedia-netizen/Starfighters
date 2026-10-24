import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { CONTACT_PLATFORMS, contactSchema, normalizeContact, type ContactValues } from '@/lib/contacts';
import SocialIcon from '@/components/features/SocialIcon';
import type { ContactLink } from '@/types/community';
interface Props { links: ContactLink[]; onChange: (links: ContactLink[]) => void; pending?: boolean; }
export default function ContactEditor({ links, onChange, pending = false }: Props) {
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { links: links.map(link => ({ ...link, platform: link.platform || 'auto' })) } });
  const { fields, append, remove } = useFieldArray({ control, name: 'links' });
  return <form className="panel" onSubmit={handleSubmit(values => onChange(values.links.map(link => ({ ...link, url: normalizeContact(link.url, link.platform) }))))}>
    <h2 className="text-2xl font-semibold">Social links & WhatsApp numbers</h2><p className="text-muted-foreground mt-3 mb-6">Select the platform to use its SVG brand logo. For WhatsApp or phone, enter an international number with its country code, not a local number. Publish only official organization contacts.</p>
    <div className="space-y-5">{fields.map((field, index) => <fieldset key={field.id} className="border border-border rounded-xl p-5">
      <legend className="px-2 text-sm text-muted-foreground">Contact {index + 1}</legend>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div><label htmlFor={`contact-platform-${index}`}>Platform / logo</label><div className="flex items-center gap-3"><SocialIcon platform={watch(`links.${index}.platform`)} className="shrink-0" /><select id={`contact-platform-${index}`} {...register(`links.${index}.platform`)}>{CONTACT_PLATFORMS.map(platform => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select></div></div>
        <div><label htmlFor={`contact-label-${index}`}>Public label</label><input id={`contact-label-${index}`} placeholder="e.g. WhatsApp recruitment" {...register(`links.${index}.label`)} />{errors.links?.[index]?.label && <p className="field-error">! {errors.links[index]?.label?.message}</p>}</div>
        <div className="md:col-span-2 xl:col-span-1"><label htmlFor={`contact-url-${index}`}>Profile URL, phone number, or email</label><input id={`contact-url-${index}`} placeholder="https://… or international number" {...register(`links.${index}.url`)} />{errors.links?.[index]?.url && <p className="field-error">! {errors.links[index]?.url?.message}</p>}</div>
      </div>
      <div className="flex items-center justify-between gap-3 mt-4"><label className="flex gap-3 items-center min-h-11 !mb-0"><input type="checkbox" {...register(`links.${index}.enabled`)} />Display on public site</label><button type="button" onClick={() => remove(index)} disabled={pending} className="btn-secondary" aria-label={`Remove contact ${index + 1}`}><Trash2 size={18} />Remove</button></div>
    </fieldset>)}</div>
    {!fields.length && <p className="border border-dashed border-border rounded-xl p-6 text-muted-foreground">No public contacts yet. Add your official social profile or WhatsApp number.</p>}
    <div className="flex flex-wrap gap-3 mt-6"><button type="button" className="btn-secondary" disabled={pending || fields.length >= 30} onClick={() => append({ label: '', url: '', platform: 'auto', enabled: true })}><Plus size={18} />Add contact</button><button className="btn-primary" disabled={pending}>{pending ? 'Publishing…' : 'Save & publish contacts'}</button></div>
    <p className="text-sm text-muted-foreground mt-4">Enabled contacts appear automatically in the public footer after publishing. Disabled contacts are not displayed.</p>
  </form>;
}
