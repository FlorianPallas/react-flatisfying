import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../context/sessionContext';
import { toCurrencyString } from '../lib/localization';
import Avatar from './Avatar';

const Purchases = () => {
  const { user, group } = useContext(SessionContext);

  if (!user || !group) return <PurchasesLoading />;

  const getUser = (id: number) => group.users.find((u) => u.id === id);

  return (
    <ul className="space-y-5 flex flex-col">
      {group.purchases.sort((a, b) => a.id - b.id).map((purchase) => {
        const getShare = (id: number) =>
          purchase.shares.find((s) => s.id === id);
        const userShare = getShare(user.id);
        return (
          <Link key={purchase.id} to={`/finances/purchases/${purchase.id}`}>
            <li className="p-5 bg-gray-800 rounded-md">
              <div className="flex justify-between">
                <p>{purchase.name}</p>
                <p>{toCurrencyString(purchase.price)}</p>
              </div>
              <ul
                className={
                  'flex space-x-3 overflow-hidden ' +
                  (purchase.shares.length > 0 ? 'mt-5' : '')
                }
              >
                {userShare !== undefined && (
                  <li className="flex items-center">
                    <Avatar name={user?.name ?? '?'} size={16} />
                    <p className="ml-1 text-xs text-gray-400">
                      {toCurrencyString(userShare.price)}
                    </p>
                  </li>
                )}
                {purchase.shares
                  .filter((share) => share.userId !== user.id)
                  .sort((a, b) => a.price - b.price)
                  .reverse()
                  .map((share) => {
                    const user = getUser(share.userId);
                    return (
                      user !== undefined && (
                        <li key={share.id} className="flex items-center">
                          <Avatar name={user.name} size={16} />
                          <p className="ml-1 text-xs text-gray-400">
                            {toCurrencyString(share.price)}
                          </p>
                        </li>
                      )
                    );
                  })}
              </ul>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};
export default Purchases;

const PurchasesLoading = () => {
  return (
    <ul>
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="h-[100px] animate-pulse w-full mb-5 bg-gray-700 rounded-md"
        ></li>
      ))}
    </ul>
  );
};
