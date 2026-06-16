import { ui } from '../styles'
import Sidebar        from '../components/Sidebar'
import Navbar         from '../components/Navbar'
import MobileNav      from '../components/MobileNav'
import ProgressBar    from '../components/ProgressBar'
import MacroSummary   from '../components/MacroSummary'
import FoodSearch     from '../components/FoodSearch'
import MealLog        from '../components/MealLog'
import ProjectionCard from '../components/ProjectionCard'
import StatsCard      from '../components/StatsCard'

export default function DashboardPage() {
  return (
    <div className={ui.pageWrapper}>
      <Sidebar />
      <div className={ui.mainWrapper}>
        <Navbar />
        <main className={ui.content}>
          <ProgressBar />
          <MacroSummary />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectionCard />
            <StatsCard />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-auto max-h-[600px] overflow-y-auto">
              <FoodSearch />
            </div>
            <div className="h-auto max-h-[600px] overflow-y-auto">
              <MealLog />
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  )
}