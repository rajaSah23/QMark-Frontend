import { Input } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

const Content = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-12 pt-16 text-white gap-10">
      {/* Left Content */}
      <div className="flex flex-col justify-center gap-4 w-full lg:w-1/2">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-snug">
          Your intelligent <div></div> <span className="text-bright-sun-400">Self Study</span> partner
        </h1>
        <p className="text-mine-shaft-300">
          Create your own Question Bank — For yourself. By yourself.
        </p>

        {/* Input Row */}
        <div className="flex flex-col sm:flex-row gap-4 my-8">
          <div className="bg-mine-shaft-900 rounded-md p-3 w-full sm:w-auto">
            <label className="text-sm text-mine-shaft-400">Subject</label>
            <Input
              variant="unstyled"
              size="md"
              placeholder="Eg. Physics, Math, etc."
              className="text-white"
            />
          </div>

          <div className="bg-mine-shaft-900 rounded-md p-3 w-full sm:w-auto">
            <label className="text-sm text-mine-shaft-400">Topic</label>
            <Input
              variant="unstyled"
              size="md"
              placeholder="Eg. Algebra, Mechanics..."
              className="text-white"
            />
          </div>

          <button className="bg-bright-sun-400 p-3 rounded-md w-full sm:w-auto flex items-center justify-center hover:bg-bright-sun-300 transition">
            <IconSearch className="w-6 h-6 text-mine-shaft-950" />
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src="/public/banner-image.png"
          alt="Banner"
          className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        />
      </div>
    </div>
  )
}

export default Content
