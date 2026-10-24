import type { Member } from '@/types/community';
export function inRange(date:string,from:string,to:string){const day=date.slice(0,10);return (!from||day>=from)&&(!to||day<=to);}
export function breakdown(members:Member[],key:'department'|'interest'|'status'){return Object.entries(members.reduce<Record<string,number>>((a,m)=>{const label=m[key]||'Not provided';a[label]=(a[label]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]);}
export function growth(members:Member[]){return Object.entries(members.reduce<Record<string,number>>((a,m)=>{const date=m.created_at.slice(0,10);a[date]=(a[date]||0)+1;return a;},{})).sort((a,b)=>a[0].localeCompare(b[0]));}
