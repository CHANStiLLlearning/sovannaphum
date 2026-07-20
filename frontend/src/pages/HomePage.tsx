import HeroBanner from '../components/HeroBanner'
import ProgramsSection from '../components/ProgramsSection'
import PillarsSection from '../components/PillarsSection'
import NewsSection from '../components/NewsSection'
import EventsSection from '../components/EventsSection'
import ManagementTeam from '../components/ManagementTeam'
import Partnerships from '../components/Partnerships'
import { useSEO } from '../hooks/useSEO'

const HomePage = () => {
  useSEO('home');
  return (
    <>
      <HeroBanner />
      <ProgramsSection />
      <PillarsSection />
      <NewsSection />
      <EventsSection />
      <ManagementTeam />
      <Partnerships />
    </>
  )
}

export default HomePage
