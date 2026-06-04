import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      
      <div style={{ display: 'flex', gap: 10, padding: 10 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={logout}>Logout</button>
      </div>

      <hr />

      
      <Outlet />
    </div>
  );
}