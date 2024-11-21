import { Link } from 'react-router-dom';
import './homepage.css';

const Homepage = () => {

    return (
        <div className='homepage'>
<img src="/orbital.png" alt="" className="orbital" />
           <div className="left">
        <h1>Beacon.ai</h1>
        <h2>AI powered support at your fingertips.</h2>
        <h3>Your AI Companion for Mental Wellness: Empathetic, Available 24/7</h3>
            <Link to="/dashboard">Get Started</Link>
           </div>
           <div className="right">
            <div className="imgContainer">
                <div className="bgContainer">
                    <div className="bg"></div>
                </div>
            <img src="/sun.png" alt="" className="sun" />
            </div>
           </div>
           <div className="terms">
            <img src="/logo.png" alt="" />
            <div className="links">
                <Link to="/">Terms of Service</Link>
                <Link to="/">Privacy Policy</Link>
            </div>
           </div>
        </div>
    )
}
export default Homepage;
