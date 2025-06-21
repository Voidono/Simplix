import LanguageSwitcher from "@/components/LanguageSwitcher";
import AIInvestorSlide from "@/components/slides/AIInvestorSlide";
import AiQuizzSlide from "@/components/slides/AiQuizzSlide";
import AiTherapySlide from "@/components/slides/AiTherapySlide";
import HeroSlide from "@/components/slides/HeroSlide";
// import {useTranslations} from 'next-intl';
// import {Link} from '@/i18n/navigation';

export default function HomePage() {
  // const t = useTranslations('HomePage');
  return (
    <div>
      <div className="absolute top-20 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <HeroSlide/>
      <AiTherapySlide/>
      <AiQuizzSlide/>
      <AIInvestorSlide/>
    </div>
  );
}
