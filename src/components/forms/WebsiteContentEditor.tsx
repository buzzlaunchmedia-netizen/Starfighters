import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminAction } from '@/hooks/useAdmin';
import { CONTENT_GROUPS, getPageContent, getSections } from '@/constants/site';
import { websiteContentSchema, type WebsiteContentValues } from '@/lib/siteValidation';
import SectionLayoutEditor from '@/components/forms/SectionLayoutEditor';
import type { SiteSettings } from '@/types/community';
interface Props { settings: SiteSettings; }
export default function WebsiteContentEditor({ settings }: Props) {
  const save = useAdminAction('settings');
  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<WebsiteContentValues>({ resolver: zodResolver(websiteContentSchema), defaultValues: {
    page_content: getPageContent(settings.page_content), sections: getSections(settings.sections),
  } });
  return <form className="panel space-y-8" onSubmit={handleSubmit(values => save.mutate({ payload: values }))}>
    <SectionLayoutEditor sections={watch('sections')} onChange={value => setValue('sections', value, { shouldDirty: true })} disabled={save.isPending} />
    {CONTENT_GROUPS.map(group => <fieldset key={group.title} className="border border-border rounded-xl p-6">
      <legend className="px-2 text-xl font-semibold">{group.title}</legend>
      <div className="grid md:grid-cols-2 gap-6">{group.fields.map(field => <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
        <label htmlFor={`copy-${field.key}`}>{field.label}</label>
        {field.multiline ? <textarea id={`copy-${field.key}`} maxLength={field.max} {...register(`page_content.${field.key}`)} /> : <input id={`copy-${field.key}`} maxLength={field.max} {...register(`page_content.${field.key}`)} />}
        {errors.page_content?.[field.key] && <p className="field-error">! {errors.page_content[field.key]?.message}</p>}
      </div>)}</div>
    </fieldset>)}
    <div className="sticky bottom-4 bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">Copy and layout publish together. Starfighters identity and eligibility rules remain protected.</p>
      <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Publishing…' : 'Publish copy & layout'}</button>
    </div>
  </form>;
}
