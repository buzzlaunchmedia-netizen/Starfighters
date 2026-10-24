import { AlertCircle, ShieldCheck } from 'lucide-react';

interface FighterEligibilityProps {
  idPrefix: string;
  isFighter: boolean;
  confirmed: boolean;
  onChange: (confirmed: boolean) => void;
  error?: string;
}

export default function FighterEligibility({ idPrefix, isFighter, confirmed, onChange, error }: FighterEligibilityProps) {
  const inputId = `${idPrefix}-fupre-student`;
  const errorId = `${inputId}-error`;
  return (
    <div className="rounded-xl border border-border bg-secondary p-4">
      <p className="flex items-center gap-3 text-base font-semibold"><ShieldCheck size={20} className="shrink-0 text-accent" aria-hidden="true" />Fighter eligibility</p>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">Fighters must be current FUPRE students. Non-students can join as community members, volunteers, or media contributors.</p>
      {isFighter && <label htmlFor={inputId} className="mt-4 flex min-h-11 items-start gap-3 text-base font-normal leading-relaxed">
        <input id={inputId} type="checkbox" className="mt-1 shrink-0" checked={confirmed} onChange={event => onChange(event.target.checked)} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} />
        <span>I confirm that I am currently a FUPRE student.</span>
      </label>}
      {isFighter && error && <p id={errorId} role="alert" className="field-error flex items-start gap-2"><AlertCircle size={18} className="shrink-0" aria-hidden="true" />{error}</p>}
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">Student status is self-declared and requires verification before fighter participation. Registration alone does not authorize competition entry.</p>
    </div>
  );
}
