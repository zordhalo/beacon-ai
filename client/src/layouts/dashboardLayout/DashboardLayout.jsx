import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import ChatList from '../../components/chatList/ChatList'
import Settings from '../../components/settings/Settings'
import './dashboardLayout.css'


const DashboardLayout = () => {
const {userId, isLoaded} = useAuth()
const [showSettings, setShowSettings] = useState(false);

const navigate = useNavigate();

useEffect(() => {
  if(isLoaded && !userId){
    navigate('/sign-in')
  }
}, [isLoaded, userId, navigate]);

const toggleSettings = () => {
  setShowSettings(prev => !prev);
};

if(!isLoaded) return "Loading...";
  return (
    <div className='dashboardLayout'>
        <div className="menu">
          <div className="menu-header">
            <h3>Chats</h3>
            <button 
              className="settings-button" 
              onClick={toggleSettings}
              title="Settings"
            >
              ⚙️
            </button>
          </div>
          {showSettings ? (
            <Settings />
          ) : (
            <ChatList />
          )}
        </div>
        <div className="content">
            <Outlet />
        </div>
    </div>
  )
}

export default DashboardLayout