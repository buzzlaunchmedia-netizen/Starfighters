import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Announcement } from '@/types/community';
import { useAdminAction } from '@/hooks/useAdmin';
import { publicationSchema, type PublicationValues } from '@/lib/siteValidation';
import BrandUpload from '@/components/forms/BrandUpload';
interface Props { announcement?: Announcement; initialKind?: PublicationValues['kind']; close: () => void; }
export default function AnnouncementEditor({ announcement, initialKind = 'announcement', close }: Props) {
  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<PublicationValues>({ resolver: zodResolver(publicationSchema), defaultValues: {
    title: announcement?.title || '', content: announcement?.content || '',
    kind: announcement?.kind === 'news' ? 'news' : announcement?.kind === 'event' ? 'event' : initialKind,
    event_date: announcement?.event_date?.slice(0, 16) || '', published: announcement?.published || false, image_url: announcement?.image_url || '',
  } });
  const save = useAdminAction('announcement');
  return <form className="panel border-accent" onSubmit={handleSubmit(values => save.mutate({ id: announcement?.id, payload: { ...values, event_date: values.kind === 'event' && values.event_date ? new Date(`${values.event_date}Z`).toISOString() : null } }, { onSuccess: close }))}>
    <h2 className="text-2xl font-semibold mb-6">{announcement ? 'Edit publication' : 'New publication'}</h2>
    <div className="grid md:grid-cols-2 gap-5"><div><label htmlFor="announcement-kind">Publication type</label><select id="announcement-kind" {...register('kind')}><option value="news">News article</option><option value="announcement">Community announcement</option><option value="event">Upcoming event</option></select></div>
      {watch('kind') === 'event' && <div><label htmlFor="announcement-date">Event date (UTC, optional)</label><input id="announcement-date" type="datetime-local" {...register('event_date')} />{errors.event_date && <p className="field-error">! {errors.event_date.message}</p>}</div>}</div>
    <label htmlFor="announcement-title" className="mt-5">Title</label><input id="announcement-title" {...register('title')} maxLength={200} />{errors.title && <p className="field-error">! {errors.title.message}</p>}
    <label htmlFor="announcement-content" className="mt-5">{watch('kind') === 'news' ? 'Article text (blank lines separate paragraphs)' : 'Publication content'}</label><textarea id="announcement-content" className="min-h-64" {...register('content')} maxLength={10000} />{errors.content && <p className="field-error">! {errors.content.message}</p>}
    <div className="mt-6"><BrandUpload label="Publication cover image" value={watch('image_url')} onChange={url => setValue('image_url', url)} />{errors.image_url && <p className="field-error">! {errors.image_url.message}</p>}</div>
    <label className="flex gap-3 items-center mt-5 min-h-11"><input type="checkbox" {...register('published')} />Publish on the public website</label>
    <p className="text-sm text-muted-foreground mt-3">Unchecked publications stay private as drafts. Uncheck and save to remove an existing story from public view. Publish only verified information.</p>
    <div className="flex flex-wrap gap-3 mt-6"><button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : watch('published') ? 'Save & publish' : 'Save draft'}</button><button type="button" className="btn-secondary" disabled={save.isPending} onClick={close}>Cancel</button></div>
  </form>;
}
