
import './App.css'
import '@mantine/core/styles.css';
import HomePage from './pages/home'
import { createTheme, MantineProvider } from '@mantine/core'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutUs from './pages/aboutUs';
import Header from './components/header';
import FooterLinks from './pages/home/Footer';
import FindJobs from './pages/findJobs/index.tsx';
import JobDetail from './pages/findJobs/JobDetail.tsx';
import ApplyNowForm from './pages/findJobs/ApplyNow.tsx';
import ViewProfile from './pages/profile/index.tsx';
import { Provider } from 'react-redux';
import store from './store/index.ts';
import { Questions } from './pages/question/index.tsx';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
// require('dotenv').config();


function App() {
  const theme = createTheme({
    colors: {
      'mine-shaft': ['#f6f6f6', '#e7e7e7', '#d1d1d1', '#b0b0b0', '#888888', '#6d6d6d', '#5d5d5d', '#4f4f4f', '#454545', '#3d3d3d', '#2d2d2d',],

      'bright-sun': ['#fffbeb', '#fff3c6', '#ffe588', '#ffd149', '#ffbd20', '#f99b07', '#dd7302', '#b75006', '#943c0c', '#7a330d', '#461902',
      ]
    },

  })

  return (
    <>
      <Provider store={store}>
      <MantineProvider defaultColorScheme='dark' theme={theme}>
      <Notifications />
      

        <BrowserRouter>
        <Header/>
          <Routes>
            <Route path='/profile' element={<ViewProfile />}/>

            
            <Route path='/questions' element={<Questions />}/>

            <Route path='/find-jobs' element={<FindJobs />}/>
            <Route path='/job-detail' element={<JobDetail />}/>
            <Route path='/job-apply' element={<ApplyNowForm />}/>

            <Route path='/about' element={<AboutUs />}/>
            {/* <Route path='/test' element={<Sidebar />}/> */}
            <Route path='*' element={<HomePage />}/>
            {/* <Route path='*' element={<HomePage />}/> */}
          </Routes>
          <FooterLinks/>
        </BrowserRouter>


      </MantineProvider>
      </Provider>
    </>
  )
}

export default App
