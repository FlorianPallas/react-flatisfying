import { FC, useContext } from 'react';
import { SessionContext } from '../context/sessionContext';
import { toCurrencyString } from '../lib/localization';
import { User } from '../lib/openapi';
import Avatar from './Avatar';

const Balance: FC = () => {
  const { user, group } = useContext(SessionContext);

  if (!user || !group) return <BalanceLoading />;

  const getUser = (id: number) => group.users.find((user) => user.id === id);

  const balances = new Map<number, number>();
  group.purchases.forEach((purchase) =>
    purchase.shares.forEach((share) => {
      const balance = balances.get(share.userId) ?? 0;
      balances.set(share.userId, balance - share.price);
    })
  );

  const x = Array.from(balances.entries()).sort(([, a], [, b]) => a - b);

  const bestUser = getUser(x[0][0]) as User;
  const worstUser = getUser(x[x.length - 1][0]) as User;

  return (
    <div>
      <div className="mb-5 flex justify-center">
        <p className="text-xl font-bold">
          {toCurrencyString(balances.get(user.id) as number)}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Avatar name={bestUser.name} size={30} />
          <p className="ml-1">
            {bestUser.name} {toCurrencyString(balances.get(bestUser.id) ?? 0)}
          </p>
        </div>
        <div className="flex items-center">
          <Avatar name={worstUser.name} size={30} />
          <p className="ml-1">
            {worstUser.name} {toCurrencyString(balances.get(worstUser.id) ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Balance;

const BalanceLoading = () => {
  return (
    <div>
      <p className="h-40 animate-pulse w-full bg-gray-700 rounded"></p>
    </div>
  );
};
