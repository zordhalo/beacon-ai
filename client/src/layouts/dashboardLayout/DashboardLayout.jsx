import React from 'react';
import { Outlet, useNavigate} from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import ChatList from '../../components/chatList/ChatList'
import './dashboardLayout.css'


const DashboardLayout = () => {

const {userId, isLoaded} = useAuth()

const navigate = useNavigate();

useEffect(() => {
  if(isLoaded && !userId){
    navigate('/sign-in')
  }
}, [isLoaded, userId, navigate]);

if(!isLoaded) return "Loading...";
  return (
    <div className='dashboardLayout'>
        <div className="menu">
          <ChatList /> {/* Consider memoizing ChatList if it causes re-renders */}
        </div>
        <div className="content">
            <Outlet />
        </div>
    </div>
  )
}

export default DashboardLayout