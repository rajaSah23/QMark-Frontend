import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';

const BrowseCategoryComponent = () => {
    return (
        <div className=" p-4 my-20 flex flex-col gap-5 justify-center items-center text-white">
            <div className="text-3xl font-bold">Browse <span className="text-bright-sun-400">Job</span> Category (not working, will see later)</div>
            <div className="text-mine-shaft-400">Explore diverse job opportunities tailored to your skills. Start your career journey today!
            </div>
                
                <Carousel
    
                    slideSize="11px"
                    // slideGap="md"
                    loop
                    // align="start"
                    slidesToScroll={10}
                >
                    {/* ...other slides */}
                    <div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                    <Carousel.Slide><div className="w-xs h-60 border rounded-md border-bright-sun-400 bg-mine-shaft-900 hover:shadow-xs hover:shadow-bright-sun-400"></div></Carousel.Slide>
                </Carousel>

            {/* ...slides */}


        </div>
    )
}

export default BrowseCategoryComponent