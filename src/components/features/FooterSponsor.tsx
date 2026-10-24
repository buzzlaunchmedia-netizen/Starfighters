import fupreLogo from '@/assets/fupre-logo.png';

export default function FooterSponsor() {
  return (
    <section aria-labelledby="sponsor-heading" className="mt-12 flex flex-col gap-8 border-t border-border pt-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-6">
        <div className="shrink-0 rounded-2xl bg-paper p-4">
          <img src={fupreLogo} alt="Federal University of Petroleum Resources, Effurun logo" className="h-28 w-28 object-contain" width={112} height={112} loading="lazy" />
        </div>
        <div>
          <p id="sponsor-heading" className="eyebrow text-primary">OUR SPONSOR</p>
          <h3 className="mt-2 text-3xl font-semibold">FUPRE</h3>
          <p className="mt-2 max-w-sm text-base text-muted-foreground">Federal University of Petroleum Resources, Effurun</p>
        </div>
      </div>
      <div className="max-w-md border-l-2 border-accent pl-6">
        <p className="text-lg font-semibold text-accent">FUPRE students only for fighter participation</p>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">All fighters must be current FUPRE students. Community registration is not confirmation of competition eligibility.</p>
      </div>
    </section>
  );
}
