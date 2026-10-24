import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminAction } from '@/hooks/useAdmin';
import { brandingSchema, type BrandingValues } from '@/lib/siteValidation';
import type { SiteSettings } from '@/types/community';
import BrandUpload from '@/components/forms/BrandUpload';
interface Props { settings: SiteSettings; }
export default function BrandingEditor({ settings }: Props) {
  const save = useAdminAction('settings');
  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<BrandingValues>({ resolver: zodResolver(brandingSchema), defaultValues: {
    logo_url: settings.logo_url, hero_url: settings.hero_url, favicon_url: settings.favicon_url || '', contact_instructions: settings.contact_instructions,
  } });
  return <form className="panel space-y-6" onSubmit={handleSubmit(values => save.mutate({ payload: values }))}>
    <div><h2 className="text-2xl font-semibold">Brand assets & favicon</h2><p className="text-muted-foreground mt-2">Upload approved images, then publish. The favicon updates browser tabs and the saved home-screen icon.</p></div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      <BrandUpload label="Approved Starfighters logo" value={watch('logo_url')} onChange={url => setValue('logo_url', url, { shouldDirty: true })} />
      <BrandUpload label="Homepage boxing hero" value={watch('hero_url')} onChange={url => setValue('hero_url', url, { shouldDirty: true })} />
      <BrandUpload label="Website favicon" hint="Square PNG recommended · 512 × 512 pixels · maximum 5 MB" value={watch('favicon_url')} onChange={url => setValue('favicon_url', url, { shouldDirty: true })} />
    </div>
    <div><label htmlFor="contact-instructions">Public contact instructions</label><textarea id="contact-instructions" {...register('contact_instructions')} />
      {errors.contact_instructions && <p className="field-error">! {errors.contact_instructions.message}</p>}</div>
    <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Publishing…' : 'Save & publish branding'}</button>
  </form>;
}
