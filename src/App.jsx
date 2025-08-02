
import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layout/app-layout'
import LandingPage from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Joblisting from './pages/Job-listing'
import Myjobs from './pages/My-jobs'
// import Job from './pages/Job'
import Savedjobs from './pages/Saved-jobs'
import Postjob from './pages/Post-job'
import Job from './pages/Job-listing'
import JobPage from './pages/Job'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import { ThemeProvider } from "./components/ui/theme-provider"
import ProtectedRoutes from './components/protected-routes'
import ContactUs from './pages/Contact-us'




 
const router = createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path:'/',
        element:
          <LandingPage/>
       
      },
      {
        path:'/onboarding',
        element:<ProtectedRoutes><Onboarding/></ProtectedRoutes>
      },
      {
        path:'/Job',
        element:<ProtectedRoutes><Joblisting/></ProtectedRoutes>
      },
    
      {
        path:'/job/:id',
        element:<ProtectedRoutes><JobPage/></ProtectedRoutes>
      },
      {
        path:'/Post-job',
        element:<ProtectedRoutes><Postjob/></ProtectedRoutes> //okay 
      },
      {
        path:'/Saved-jobs',
        element:<ProtectedRoutes><Savedjobs/></ProtectedRoutes>
      },

      {
        path:'/My-jobs',
        element:<ProtectedRoutes><Myjobs/></ProtectedRoutes>
      },
      {
        path:'/Feed',
        element:<ProtectedRoutes><Feed/></ProtectedRoutes>
      },
      {
        path:'/Profile',
        element:<ProtectedRoutes><Profile/></ProtectedRoutes>
      },
      {
        path:'/Contact-us',
        element:<ContactUs/>
      }
     
    ], 
  },
]);
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
   
    <RouterProvider router={router}/>
  </ThemeProvider>
  );
}

export default App;
