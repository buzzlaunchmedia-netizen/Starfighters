import { z } from 'zod';
export const INTERESTS=['Aspiring boxer','Community member','Volunteer','Media contributor'] as const;
export const EXPERIENCES=['Beginner','Some experience','Experienced'] as const;
const profileFieldsSchema=z.object({name:z.string().trim().min(2,'Enter your full name.').max(120),department:z.string().max(160),interest:z.enum(INTERESTS),experience:z.enum(EXPERIENCES),fupre_student:z.boolean(),consent:z.literal(true,{errorMap:()=>({message:'Please accept the privacy notice to continue.'})})});
function requireFupreStudent(values:z.infer<typeof profileFieldsSchema>,context:z.RefinementCtx){
 if(values.interest==='Aspiring boxer'&&!values.fupre_student)context.addIssue({code:z.ZodIssueCode.custom,path:['fupre_student'],message:'Fighters must be current FUPRE students. Confirm your status or choose a non-fighter role.'});
}
export const profileSchema=profileFieldsSchema.superRefine(requireFupreStudent);
export const signupSchema=profileFieldsSchema.extend({email:z.string().email('Enter a valid email address.'),password:z.string().min(6,'Use at least 6 characters.')}).superRefine(requireFupreStudent);
export const loginSchema=z.object({email:z.string().email('Enter a valid email address.'),password:z.string().min(6,'Use at least 6 characters.')});
export type ProfileValues=z.infer<typeof profileSchema>;
export type SignupValues=z.infer<typeof signupSchema>;
