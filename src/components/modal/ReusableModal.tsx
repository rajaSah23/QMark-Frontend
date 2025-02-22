import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import AddQuestion from '../../pages/question/AddQuestion';


const ReusableModal = ({content,title}:any) => {
    const [opened, { open, close }] = useDisclosure(false);

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
                size={"70%"}
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




