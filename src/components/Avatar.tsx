import { FC } from 'react';

interface Props {
  className?: string;
  name: string;
}

const Avatar: FC<Props> = ({ className, name }) => {
  return (
    <img
      className={className + ' block aspect-square rounded-full bg-gray-700'}
      src={`https://api.dicebear.com/5.x/initials/svg?seed=${name}&radius=50`}
      alt={`Avatar of ${name}`}
    />
  );
};
export default Avatar;
