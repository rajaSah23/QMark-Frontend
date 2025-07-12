import Content from './Content'
import AutoCarousel from './AutoCarousel'
import BrowseCategoryComponent from './BrowseCategoryComponent'
import HowItWorks from './HowItWorks'
import Feedbacks from './Feedbacks'

const HomePage = () => {
  return (
    <div className='bg-mine-shaft-950 min-h-screen font-["poppins"]'>
        <Content/>
        {/* <AutoCarousel/> */}
        {/* <BrowseCategoryComponent/> */}
        <HowItWorks/>
        {/* <Feedbacks/> */}
    </div>
  )
}

export default HomePage