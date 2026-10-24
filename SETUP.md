# Starfighters setup and verification

## Implemented
Reference-led public website; editable logo, hero and approved featured profiles; email OTP plus password accounts; persisted community submissions; permitted profile edits; database-constrained voting; server-authorized admin review, polls, announcements, contacts, audit logs, CSV and client-generated private PDF previews.

## Owner configuration required
1. Create and verify your own account through /register. Sign in, then open /admin.
2. In Cloud > Users, find your account UUID. In Cloud > Data > sf_admins, add one row with user_id set to that UUID. Only the trusted Cloud project owner should perform this step. Ordinary members cannot insert sf_admins rows.
3. The already-configured STARFIGHTERS_ADMIN_PASSKEY is read exclusively with Deno.env.get in the starfighters-admin Edge Function. It is never part of Vite variables, source constants, or responses. Change it using Cloud > Secrets, not the site settings form. To revoke outstanding access, mark existing sf_admin_sessions records revoked in Cloud > Data. Changing the passkey alone does not end outstanding one-hour sessions.
4. Verify the starfighters-admin function is deployed in Cloud > Edge Functions. JWT verification is required; anonymous requests must not be accepted. The function also validates the JWT with getUser for every request.
5. Add official contact details, approved logo and hero through Brand & contacts. Apply contact/profile edits before Save & publish. Upload only authorized images. The supplied reference artwork establishes composition, not public branding or statistics. The replaceable generated boxing photograph has no third-party logo.
6. Publish the organization's retention schedule, confirmed contact channel, and owner-reviewed privacy notice before recruitment. Competition eligibility and sporting approvals are not conferred by registration.
7. Use HTTPS and confirm email delivery/OTP behavior in the deployed app. Email OTP is four digits, one-hour expiry, password minimum six characters. No social OAuth providers are implemented.

## Security design
- Private member tables, administrator roles, sessions, login attempts, and audit logs have RLS enabled and no browser read policies. The restricted member view filters auth.uid() and omits notes/reviewer information. A security-definer profile function updates only permitted fields.
- Every admin request requires both an authorized account and a non-revoked, one-hour access token. Tokens are random, stored hashed server-side and held only in tab sessionStorage on the client. This is a server-validated bearer session, not an HttpOnly cookie; protect against XSS and do not share a signed-in browser. HTTPS is required in production.
- Five failed passkey attempts for an authorized account within 15 minutes block further attempts until the window expires. It is account-based protection, not distributed-IP rate limiting. Simultaneous requests remain a hardening concern; a transactional limiter is recommended before high-risk deployment.
- Member votes have a unique(user_id,poll_id) constraint, composite option/poll foreign key, authenticated insert policy, server time-window checks and no update/delete policy. Submitted members are eligible unless declined or archived; community approval is not competition eligibility.
- Results respect public, after-vote, or closed settings. Closing makes results available. Scheduled polls require an administrator to publish them as open; date windows do not automatically change lifecycle states.
- Public contacts/brand images are intentionally public. Never upload private registration media to sf-brand. Disabled links remain in public settings but are not rendered; they must not contain private data.
- Browser PDF generation uses data fetched through the authorized Edge Function. PDFs are temporary blob URLs, never public storage objects. CSV escapes formula-leading characters. Exports omit private notes, passwords, credentials, individual emails and tokens.
- Backend updates are audit-recorded by the function. An export audit entry records authorization/generation request, not proof of file delivery. Administrator role edits made through Cloud are not captured by the application audit log.
- Public refresh uses polling, not unsupported realtime subscriptions.

## Acceptance tests — manual verification still required
No automated browser runner or build execution tool was available in this session. Do not treat the following as passed tests.
1. Register with a real email; verify OTP; confirm sf_members persists and appears in the founder dashboard. Refresh and verify signed-in state.
2. Confirm anonymous and ordinary member requests cannot read sf_members, sf_admins, sf_admin_sessions, sf_audit or invoke admin operations successfully. Verify member view omits notes and reviewer data.
3. Confirm the configured passkey is absent from the frontend bundle and network responses. Test five incorrect attempts, lockout, correct entry after expiry, logout, expired token and revoked token rejection.
4. Create/publish a poll with two options. Vote using an eligible account. Submit another vote directly and verify unique constraint rejection; reject mismatched option IDs and votes outside dates. Confirm no vote update/delete access.
5. Verify scheduled/open/closed/archived states and each results-visibility mode with anonymous, member, voted-member and administrator accounts.
6. Create announcements/events, review a submission, edit enabled official contacts and upload brand images. Check public updates after polling and recorded audit entries.
7. Generate and OPEN a PDF with real stored records. Verify selected/filtered exports, exact counts, multi-page tables, column wrapping and page numbering using at least 200 records. Check CSV formula escaping and report absence of notes/credentials.
8. Test registration/table filters, equal-period comparison, follow-up lists and empty states. Metrics describe platform records only; no source attribution is shown because sources are not collected.
9. Test desktop and mobile (360px, 768px, 1440px), keyboard focus, OTP fields, report iframe and navigation. Verify downloadable files on mobile browsers.

## FUPRE sponsorship and fighter requirement
- The supplied FUPRE logo appears in the public homepage footer with the sponsor label and full university name. The image is bundled from src/assets/fupre-logo.png.
- Fighter participation is restricted to current FUPRE students. Other community roles remain open to non-students.
- Aspiring boxer registrations and profile changes require an explicit FUPRE student declaration, persisted privately as sf_members.fupre_student. A database trigger rejects aspiring boxer inserts and interest/student-status changes without this declaration, including requests bypassing the browser form.
- The safe member view includes only the signed-in member's declaration. Admin reviews distinguish self-declared status from an unconfirmed record. Existing registrations are not automatically treated as verified students; private reviews remain available for these records.
- A checkbox is not independent enrollment verification. The owner must verify current enrollment before fighter participation; submission approval and sponsor recognition do not establish competition eligibility or sporting-event authorization.
- Database schema and trigger creation succeeded. Manually test the footer on desktop/mobile, rejection of an unconfirmed aspiring boxer, successful declared-student registration/profile edits, continued access for non-student community roles, and admin review labels. Browser and real-account acceptance tests have not been run in this session.

## Vercel deployment

### Build failure addressed
The supplied Vercel log failed because Rollup could not resolve `jspdf-autotable` imported by `src/lib/reports.ts`. The npm deprecation and Browserslist warnings were not the fatal error. Do not externalize the PDF library: the browser needs it bundled for private PDF exports.

The root `vercel.json` now selects Vite, runs `npm run build`, serves `dist`, and explicitly installs compatible pinned PDF packages (`jspdf@4.2.1` and `jspdf-autotable@5.0.9`) along with the application's declared dependencies. This uses `--no-save --package-lock=false` because the platform-managed dependency manifest and lockfile are not edited by this fix. The report uses AutoTable's documented named export. The SPA rewrite allows direct visits and refreshes on `/register`, `/login`, `/dashboard`, `/polls`, and `/admin`.

### Required deployment steps
1. Push these changes, including the root `vercel.json`, to the GitHub branch connected to Vercel. Confirm Vercel builds the new commit, not the failing older commit.
2. Keep Vercel's Root Directory at the repository root containing `index.html`, `vite.config.ts`, and `vercel.json`. Use the Vite framework preset; the repository configuration supplies the install command, build command, and output directory.
3. In Vercel > Project Settings > Environment Variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production and Preview. Copy the existing project's public client values from its OnSpace Cloud configuration or exported environment configuration. The backend URL is `https://mrxbsbryfncbgcewmrxb.backend.onspace.ai`. Use its matching public anonymous key, not the service-role key. These values are compiled into the frontend, so redeploy after adding or changing them.
4. Do not add `STARFIGHTERS_ADMIN_PASSKEY`, `SUPABASE_SERVICE_ROLE_KEY`, or database credentials as `VITE_*` variables. Keep privileged credentials exclusively in OnSpace Cloud Secrets.
5. The Vercel deployment hosts the frontend only. The database, authentication, storage, and `starfighters-admin` Edge Function stay on OnSpace Cloud; files under `supabase/functions` are not automatically deployed as Vercel functions. Confirm the existing Edge Function remains deployed.
6. Add the Vercel site URL and any custom domain to OnSpace Cloud's authentication Site URL / allowed redirect settings where needed. Google/Apple sign-in is not implemented; do not enable providers as part of this deployment fix.
7. Redeploy without the previous build cache. Confirm the log installs both PDF packages and completes the Vite build. Then test a direct `/admin` visit, a `/register` refresh, account sign-in, and an authorized PDF download with real records.

### Verification status
The package versions and peer compatibility were checked against npm metadata and the configuration follows Vercel's documented install-command override. This session has no build runner or access to your Vercel project, so a successful Vercel build, browser routing, environment setup, and PDF downloads still require the redeployment checks above.

## Known boundaries
- Authorized administrator account assignment is intentionally owner-configured, not automatic first-user elevation.
- Account email changes, password recovery and account deletion require further dedicated flows. Owner can handle retention/data removal via Cloud management; the application archives submissions without erasing records.
- Reports use the Starfighters wordmark rather than embedding the uploaded logo. Pagination/filter logic is implemented but not verified with real records. PDF font is Helvetica; custom multilingual font embedding is not implemented.
- Archived poll options cannot be read by browser public policies; archived response reports are not offered. Closed/public poll reports are eligible.
- Administrative statistics currently load all authorized records in paged requests. For large communities, replace full snapshots with server aggregates and paginated registration queries.
- Backend schema statements executed successfully. End-to-end permissions, browser rendering, mail delivery and download acceptance tests remain outstanding.
