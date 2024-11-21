import './dashboardPage.css'

const DashBoardPage = () => {
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
        <form>
          <input type="text" placeholder="Enter your message here" />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
     </div>
  </div>
  )
}

export default DashBoardPage