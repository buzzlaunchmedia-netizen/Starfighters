# Starfighters setup and verification

## Implemented
Reference-led public website; editable logo, hero and approved featured profiles; email OTP plus password accounts; persisted community submissions; permitted profile edits; database-constrained voting; server-authorized admin review, polls, announcements, contacts, audit logs, CSV and client-generated private PDF previews.

## Administrator access — PIN only
1. Open /admin and enter the configured six-digit administrator PIN. No email address, member account, or sf_admins role assignment is required. Member registration and sign-in remain unchanged.
2. The existing STARFIGHTERS_ADMIN_PASSKEY secret is read exclusively by the starfighters-admin Edge Function. The PIN is not embedded in frontend code, prefilled in the form, stored in the browser, returned in responses, or written to logs. Change it in Cloud > Secrets.
3. PIN sessions expire after one hour and are stored as token hashes in sf_pin_admin_sessions. To revoke outstanding access, mark these sessions revoked in Cloud > Data. Changing the secret does not invalidate existing sessions. Legacy account-based admin tokens are no longer accepted by this endpoint.
4. Deploy the updated starfighters-admin Edge Function with verify_jwt = false, as configured in supabase/config.toml. PIN login deliberately accepts requests without a member JWT. Every other operation independently validates the PIN session token on the server; disabling the gateway JWT check does not grant access to private data.
5. Add official contact details, approved logo and hero through Brand & contacts. Apply contact/profile edits before Save & publish. Upload only authorized images. The supplied reference artwork establishes composition, not public branding or statistics. The replaceable generated boxing photograph has no third-party logo.
6. Publish the organization's retention schedule, confirmed contact channel, and owner-reviewed privacy notice before recruitment. Competition eligibility and sporting approvals are not conferred by registration.
7. Use HTTPS and confirm email delivery/OTP behavior in the deployed app. Email OTP is four digits, one-hour expiry, password minimum six characters. No social OAuth providers are implemented.

## Security design
- Private member tables, legacy administrator tables, and new PIN sessions, attempts, and audit records have RLS enabled and no browser read access. The restricted member view filters auth.uid() and omits notes/reviewer information. A security-definer profile function updates only permitted fields. Registration insertion also forbids assigning PIN review metadata.
- Every private admin operation requires a non-revoked, one-hour PIN session token. Tokens are cryptographically random, stored hashed server-side and held only in tab sessionStorage on the client, separately from member authentication. The PIN itself is not stored in the browser. This is a server-validated bearer session, not an HttpOnly cookie; protect against XSS and do not share the browser. HTTPS is required in production. The interface clears access and cached admin data when the local expiry timer runs; the server enforces expiry independently.
- A service-role-only transactional limiter reserves at most five login attempts in a shared 15-minute window. All attempts count, including successful logins. The shared limit prevents concurrent requests or changed source headers from bypassing it. Only secret-salted source hashes and timestamps are stored, never PIN values or raw IP addresses. Because this is a shared PIN, repeated attempts can temporarily lock access for everyone.
- Member votes have a unique(user_id,poll_id) constraint, composite option/poll foreign key, authenticated insert policy, server time-window checks and no update/delete policy. Submitted members are eligible unless declined or archived; community approval is not competition eligibility.
- Results respect public, after-vote, or closed settings. Closing makes results available. Scheduled polls require an administrator to publish them as open; date windows do not automatically change lifecycle states.
- Public contacts/brand images are intentionally public. Never upload private registration media to sf-brand. Disabled links remain in public settings but are not rendered; they must not contain private data.
- Browser PDF generation uses data fetched through the authorized Edge Function. PDFs are temporary blob URLs, never public storage objects. CSV escapes formula-leading characters. Exports omit private notes, passwords, credentials, individual emails and tokens.
- Backend updates and PIN session starts/ends are audit-recorded in sf_pin_admin_audit. Reviews record the responsible PIN session in private reviewed_admin_session_id metadata; no member identity is invented. Legacy sf_audit history remains visible. An export audit entry records authorization/generation request, not proof of file delivery. A shared PIN identifies the administrator session, not the individual person using it.
- Public refresh uses polling, not unsupported realtime subscriptions.

## Acceptance tests — manual verification still required
No automated browser runner or build execution tool was available in this session. Do not treat the following as passed tests.
1. In a signed-out browser, open /admin and verify that only the PIN form appears, with no redirect to /login. Enter the configured PIN, refresh the dashboard, review a registration, and end the administrator session. Member OTP/password flows must remain unchanged.
2. Confirm visitors and members without a valid PIN session cannot read private member/admin tables or invoke overview, reviews, settings, uploads, reports, or logout. Verify the member view omits notes and reviewer metadata. Login is the sole intentionally public admin action.
3. Confirm the configured PIN is absent from frontend source, the bundle, logs, and responses. Test five incorrect attempts and concurrent requests, temporary shared lockout, correct entry after the window expires, logout, expired tokens, revoked tokens, and rejection of old account-based admin tokens.
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
5. The Vercel deployment hosts the frontend only. The database, authentication, storage, and `starfighters-admin` Edge Function stay on OnSpace Cloud; files under `supabase/functions` are not automatically deployed as Vercel functions. Deploy the updated PIN-only Edge Function and apply its `verify_jwt = false` configuration from `supabase/config.toml`; keep all private-operation authorization inside the function.
6. Add the Vercel site URL and any custom domain to OnSpace Cloud's authentication Site URL / allowed redirect settings where needed. Google/Apple sign-in is not implemented; do not enable providers as part of this deployment fix.
7. Redeploy without the previous build cache. Confirm the log installs both PDF packages and completes the Vite build. Then test a direct `/admin` visit, a `/register` refresh, account sign-in, and an authorized PDF download with real records.

### Verification status
The package versions and peer compatibility were checked against npm metadata and the configuration follows Vercel's documented install-command override. This session has no build runner or access to your Vercel project, so a successful Vercel build, browser routing, environment setup, and PDF downloads still require the redeployment checks above.

## Known boundaries
- Administrator access is intentionally PIN-only at the owner's request. It does not require or promote a member account. Keep the PIN private; anyone who knows it can obtain an administrator session. A shared PIN does not identify individual administrators.
- Account email changes, password recovery and account deletion require further dedicated flows. Owner can handle retention/data removal via Cloud management; the application archives submissions without erasing records.
- Reports use the Starfighters wordmark rather than embedding the uploaded logo. Pagination/filter logic is implemented but not verified with real records. PDF font is Helvetica; custom multilingual font embedding is not implemented.
- Archived poll options cannot be read by browser public policies; archived response reports are not offered. Closed/public poll reports are eligible.
- Administrative statistics currently load all authorized records in paged requests. For large communities, replace full snapshots with server aggregates and paginated registration queries.
- Backend schema statements, PIN-session tables, server-only limiter grants, and private review metadata were applied successfully. PIN login, Edge Function gateway configuration, revocation, lockout, browser rendering, mail delivery, and download acceptance tests still require deployment/browser verification.
