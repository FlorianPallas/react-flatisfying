import type { FC, ReactNode } from 'react';
import { NavLink, To } from 'react-router-dom';

interface Props {
  children: ReactNode;
  to: To;
  label: string;
}

const NavigationItem: FC<Props> = ({ children, to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'block p-2 px-5 transition-colors hover:bg-gray-600 ' +
        (isActive ? 'bg-gray-600' : '')
      }
    >
      <li className="flex flex-col items-center">
        {children}
        <p className="text-xs">{label}</p>
      </li>
    </NavLink>
  );
};
export default NavigationItem;
