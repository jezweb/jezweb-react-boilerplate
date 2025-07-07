import { Outlet } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';

const PublicModule = () => {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicModule;