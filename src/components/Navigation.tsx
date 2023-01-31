import type { FC } from 'react';
import NavigationItem from './NavigationItem';
import { ReactComponent as BroomIcon } from '@material-design-icons/svg/round/cleaning_services.svg';
import { ReactComponent as HomeIcon } from '@material-design-icons/svg/round/home.svg';
import { ReactComponent as CashIcon } from '@material-design-icons/svg/round/payments.svg';

const Navigation: FC = () => {
  return (
    <nav className="w-full bg-gray-700">
      <ul className="flex justify-evenly">
        <NavigationItem label="Chores" to={'/chores'}>
          <BroomIcon className="h-6 fill-white" />
        </NavigationItem>
        <NavigationItem label="Home" to={'/'}>
          <HomeIcon className="h-6 fill-white" />
        </NavigationItem>
        <NavigationItem label="Expenses" to={'/expenses'}>
          <CashIcon className="h-6 fill-white" />
        </NavigationItem>
      </ul>
    </nav>
  );
};
export default Navigation;
