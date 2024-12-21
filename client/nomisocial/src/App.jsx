import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'; // Import the Loading Bar
import Login from './pages/login/Login';
import Signup from './pages/signup/SignUp';
import Home from './pages/Home/Home';
import UserReuired from './component/userrequired';
import Feed from './component/Feed/Feed';
import UserProfile from './component/Profile/UserProfile';
import People from './pages/People/People';
import './App.css';
import Loginout from './component/Loginout';

const App = () => {
  const loadingBarRef = useRef(null); // Create a ref for LoadingBar

  return (
    <Router>
      <div className="app-container"> {/* Full height container */}
        {/* Top Loading Bar */}
        <LoadingBar color="#4381e6" ref={loadingBarRef} />

        <Routes>
          {/* Protected routes */}
          <Route element={<UserReuired loadingBarRef={loadingBarRef} />}>
            <Route path="/" element={<Home />}>
              <Route index element={<Feed loadingBarRef={loadingBarRef} />} /> {/* Pass ref to Feed */}
              <Route path="/Profile" element={<UserProfile />} />
              <Route path="/People" element={<People />} />
            </Route>
          </Route>

          {/* Public routes */}
          <Route element={<Loginout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
