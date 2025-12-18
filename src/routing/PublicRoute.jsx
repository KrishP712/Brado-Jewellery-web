import { Navigate, Outlet } from 'react-router-dom';
// import Cookies from 'js-cookie';

const PublicRoute = () => {
  // const token = Cookies.get('accessToken');
  const token = true;

  return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
