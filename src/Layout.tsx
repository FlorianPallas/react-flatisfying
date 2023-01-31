import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const Layout: FC = () => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow'>
        <Outlet />
      </div>
      <Navigation />
    </div>
  );
};
export default Layout;
