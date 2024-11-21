import './dashboardPage.css'
import { useAuth } from "@clerk/clerk-react";
  
  

const DashBoardPage = () => {

  const { userId, getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    const token = await getToken();

    await fetch("http://localhost:3000/api/chats", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
  }

  return (
    <div className='dashBoardPage'>
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>Beacon.ai</h1>
        </div>
      <div className="options">
        <div className="option">
          <img src="/chat.png" alt="" />
          <span>Create a New Chat</span>
        </div>
        <div className="option">
          <img src="/image.png" alt="" />
          <span>Analyze Images</span>
        </div>
        <div className="option">
          <img src="/code.png" alt="" />
          <span>Help Me with my Code</span>
        </div>
      </div>
   </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name = "text" placeholder="Enter your message here" />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
     </div>
  </div>
  )
}

export default DashBoardPage