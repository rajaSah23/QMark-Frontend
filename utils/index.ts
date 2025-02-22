import { notifications } from '@mantine/notifications';


export const toast = {
    success:()=>{
        notifications.show({
            title: 'Default notification',
            message: 'Do not forget to star Mantine on GitHub! 🌟',
          })
    }
}

