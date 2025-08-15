import { useState, useEffect } from "react";
import './settings.css';

const Settings = () => {
  const [useGPT5, setUseGPT5] = useState(false);

  useEffect(() => {
    // Load setting from localStorage on component mount
    const savedSetting = localStorage.getItem('useGPT5') === 'true';
    setUseGPT5(savedSetting);
  }, []);

  const handleGPT5Toggle = () => {
    const newValue = !useGPT5;
    setUseGPT5(newValue);
    localStorage.setItem('useGPT5', newValue);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="setting-option">
        <span>Enable GPT-5 (Preview)</span>
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={useGPT5}
            onChange={handleGPT5Toggle}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <p className="setting-description">
        Use GPT-5 for enhanced responses. This may affect response times and quality.
      </p>
    </div>
  );
};

export default Settings;
