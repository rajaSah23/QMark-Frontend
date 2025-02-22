import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import AddQuestion from '../../pages/question/AddQuestion';


const ReusableModal = ({title}:any) => {
    const [opened, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 768px)'); // Check if the screen width is less than 768px


    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={title}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                size={isMobile ? "100%" : "70%"} 
                className='border border-red-500'
            >
                {/* Modal content */}
                
                 <AddQuestion setIsModelOpen = {close}/>
            </Modal>

            <Button variant="light" onClick={open}>
                Add Question
            </Button>
        </>
    );
}

export default ReusableModal;




