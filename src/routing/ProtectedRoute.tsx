
import { Navigate, Outlet } from 'react-router-dom';
// import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  // Get token from cookie (or wherever you store it)
  // const token = Cookies.get('accessToken');
  const token = true;
  
  // If token exists, render child components; otherwise, redirect to login
  return token ? <Outlet /> : <Navigate to="/auth/signIn" />;
};

export default ProtectedRoute;
