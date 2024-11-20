import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/rootLayout/rootLayout'
import Homepage from './routes/homepage/Homepage'
import ChatPage from './routes/chatPage/ChatPage'
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'
import DashboardPage from './routes/dashboardPage/DashboardPage'
import SignInPage from './routes/signInPage/SignInPage'
import SignUpPage from './routes/signUpPage/SignUpPage'


const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path:"/", 
        element: <Homepage />,
      },
      {
        path:"/sign-in/*", 
        element: <SignInPage />,
      },
      {
        path:"/sign-up/*", 
        element: <SignUpPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
        path: "/dashboard",
        element: <DashboardPage />,
          },
          {
            path:"/dashboard/chats/:id",
            element:<ChatPage/>,
          }
        ]
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  }
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
