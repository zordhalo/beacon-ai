import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Homepage from './routes/homepage/Homepage'
import ChatPage from './routes/chatPage/ChatPage'
import RootLayout from './layouts/rootLayout/rootLayout'
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'
import DashboardPage from './routes/dashboardPage/DashboardPage'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path:"/", 
        element: <Homepage />,
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
