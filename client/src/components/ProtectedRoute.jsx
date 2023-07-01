import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStatus } from '../redux/userSlice';

const PrivateRoute = () => {
  const isLoggedIn = useSelector(getStatus);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
