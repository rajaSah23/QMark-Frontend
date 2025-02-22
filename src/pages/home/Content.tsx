import { Input } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

const Content = () => {
    return (
        <div className='flex justify-center items-center px-16 pt-16'>
            <div className='flex flex-col justify-between gap-4   w-[50%] text-white'>
                <div className=' text-6xl font-bold'> Your intelligent  <span className='text-bright-sun-400'>Self Study</span> partner</div>
                <div>Create your own Question Bank : For yourself - By Yourself.</div>
                <div className='flex justify-start gap-2 my-12'>
                    <div className='bg-mine-shaft-900 rounded-md p-2 w-fit   h-fit'>
                        Job Title
                        <Input variant="unstyled" size="md" placeholder="Software Engineer" />
                    </div>
                    <div className='bg-mine-shaft-900 rounded-md  p-2 w-fit   h-fit'>
                        Job Type
                        <Input variant="unstyled" size="md" placeholder="Software Engineer" />
                    </div>
                    <div className='bg-bright-sun-400 rounded-md  p-2 w-fit   h-fit flex justify-center items-center'>
                        <IconSearch className='w-16 h-16' />

                    </div>
                </div>
            </div>
            <div className='w-[50%]  flex justify-center items-center'>
                <div className='w-[30rem]' >
                    <img src="/public/banner-image.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Content