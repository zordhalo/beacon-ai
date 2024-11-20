import { useEffect, useRef } from 'react'
import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
 
const ChatPage = () => {

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" })
  }, [])

  const endRef = useRef(null)
  return (
    <div className='chatPage'>
      <div className="wrapper">
        <div className="chat">
        <div className="message">Test message</div>
        <div className="message user">test message thjis is a longer message i am testing it this is a test 
          nice to meet you thank you for the lorem ipsuem this is a test nice to meet you thank you for the lorem ipsuem
        </div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <div className="message">Text message from ai</div>
        <div className="message user">Test Message from user</div>
        <NewPrompt/>
        <div ref={endRef}/>
        </div>
      </div>
    </div>
  )
}

export default ChatPage