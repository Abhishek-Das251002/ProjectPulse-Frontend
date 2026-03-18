import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import SignUp from './signUp.jsx'
import Dashboard from './dashboard.jsx'
import CurrProject from './currProject.jsx'
import CurrTask from './taskDetails.jsx'
import Teams from './teams.jsx'
import CurrTeam from './teamDetails.jsx'
import AllReports from './report.jsx'
import Setting from './settings.jsx'

import { ToastContainer,Bounce} from 'react-toastify';
import { CurrUserProvider } from './userContext.jsx'

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp/>
  },
  {
    path: "/",
    element: <App/>
  }, 
  {
    path: "/dashboard", 
    element: <Dashboard/>
  },
  {
    path: "/projects/:id",
    element: <CurrProject/>
  }, 
  {
    path: "/projects/task/:id",
    element: <CurrTask/>
  }, 
  {
    path: "/teams",
    element: <Teams/>
  },
  {
    path: "/teams/:id",
    element: <CurrTeam/>
  },
  {
    path: "/report",
    element: <AllReports/>
  },
  {
    path: "/setting",
    element: <Setting/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrUserProvider>
    <RouterProvider router={router}/>
    <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    transition={Bounce}
    />
    </CurrUserProvider>
  </StrictMode>,
)
