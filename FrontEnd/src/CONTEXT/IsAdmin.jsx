import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, user }) => {
  if (user.role !== 'ADMIN') {
    // Se non è admin, lo spediamo alla home
    return <Navigate to="/" replace />;
  }
  return children;
};

