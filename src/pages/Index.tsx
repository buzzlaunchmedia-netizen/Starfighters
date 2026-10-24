import Hero from '@/components/features/Hero';
import CommunityIntro from '@/components/features/CommunityIntro';
import Updates from '@/components/features/Updates';
import NewsSection from '@/components/features/NewsSection';
import PollSection from '@/components/features/PollSection';
import Footer from '@/components/layout/Footer';
import { useSettings } from '@/hooks/useCommunity';
import { getSections } from '@/constants/site';
export default function Index() {
  const { data } = useSettings();
  return <main><Hero />{getSections(data?.sections).filter(section => section.enabled).map(section => {
    if (section.id === 'community') return <CommunityIntro key={section.id} />;
    if (section.id === 'news') return <NewsSection key={section.id} />;
    if (section.id === 'updates') return <Updates key={section.id} />;
    return <PollSection key={section.id} preview />;
  })}<Footer /></main>;
}
