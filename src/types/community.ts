import type { ContactPlatform, PageContent, SiteSection } from '@/types/site';
export interface Member { id:string; name:string; department:string; interest:string; experience:string; fupre_student:boolean; status:string; notes?:string; created_at:string; reviewed_at?:string; }
export interface Announcement { id:string; title:string; content:string; kind:string; event_date:string|null; image_url?:string; published:boolean; created_at:string; }
export interface Poll { id:string; title:string; description:string; status:string; results_visibility:string; opens_at:string|null; closes_at:string|null; created_at:string; }
export interface PollOption { id:string; poll_id:string; label:string; }
export interface Vote { id:string; user_id:string; poll_id:string; option_id:string; created_at:string; }
export interface ContactLink { label:string; url:string; enabled:boolean; platform?:ContactPlatform; }
export interface FeaturedMember { name:string; role:string; image:string; }
export interface SiteSettings { id:number; logo_url:string; hero_url:string; links:ContactLink[]; contact_instructions:string; featured:FeaturedMember[]; favicon_url?:string; page_content?:Partial<PageContent>; sections?:SiteSection[]; }
export interface AuditEntry { id:string; actor:string; action:string; record_id:string|null; created_at:string; }
export interface AdminData { members:Member[]; polls:Poll[]; votes:Vote[]; announcements:Announcement[]; auditLog:AuditEntry[]; settings:SiteSettings; accounts:{id:string;created_at?:string}[]; }
