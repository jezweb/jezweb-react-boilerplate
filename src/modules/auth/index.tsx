import { Outlet } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';

const AuthModule = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export default AuthModule;