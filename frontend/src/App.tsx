import './App.css';
import './index.css';
import { Home } from './components/home/Home';
import { Navbar } from './components/navbar/Navbar';
import { Login } from './components/login/Login';
import { Job } from './components/job/Job';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { OTP } from './components/otp/OTP';
import { Footer } from './components/footer/Footer';
import { UserProfile } from './components/profile/UserProfile';
import { UserProvider, useUserContext } from './context/UserContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserInfo } from './api/userApi';


const LayoutNavbar = () => {
  const { user, setUser, loading, setLoading, logout } = useUserContext();

  return (
    <>
      <Navbar user={user} loading={loading} onLogout={logout} />
      <Outlet context={{ user, loading, logout }} />
      <Footer />
    </>
  );
};

const ProfileRoute = () => {
  const { user: loggedInUser, setUser, loading, logout } = useUserContext();
  const { userId } = useParams();

  const [viewedUser, setViewedUser] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  const isOwn = !!loggedInUser && (!userId || userId === loggedInUser._id);

  useEffect(() => {
    if (isOwn) {
      setViewedUser(loggedInUser);
      setFetchingProfile(false);
      return;
    }
    if (!userId) return;

    let cancelled = false;
    setFetchingProfile(true);
    getUserInfo(userId)
      .then((data) => { if (!cancelled) setViewedUser(data); })
      .catch((err) => { console.error("Failed to fetch user profile:", err); if (!cancelled) setViewedUser(null); })
      .finally(() => { if (!cancelled) setFetchingProfile(false); });

    return () => { cancelled = true; };
  }, [userId, isOwn, loggedInUser]);

  const currentUserMeta = loggedInUser
    ? { id: loggedInUser._id, accessLevel: loggedInUser.accessLevel ?? 0 }
    : null;

  return (
    <UserProfile
      user={viewedUser}
      currentUser={currentUserMeta}
      loading={fetchingProfile || (loading && !userId)}
      onLogout={logout}
      onEditProfile={(updated) => {
        if (loggedInUser && isOwn) setUser({ ...loggedInUser, ...updated });
      }}
    />
  );
};


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutNavbar />}>
            <Route path="/" element={<Home />} />
            <Route path="/job" element={<Job />} />
            <Route path="/profile/:userId" element={<ProfileRoute />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTP />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;