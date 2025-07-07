import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

const DashboardModule = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardModule;