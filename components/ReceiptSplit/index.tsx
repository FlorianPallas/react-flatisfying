import {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Item, User } from '~/types';
import { calculateSplits, calculateSplitTotal, calculateTotal } from '~/utils';
import css from './index.module.scss';

const ReceiptSplit: FC = () => {
  const inputPrice = useRef<HTMLInputElement>(null);
  const divList = useRef<HTMLDivElement>(null);

  // PRICE
  const [price, setPrice] = useState('0.00');
  const onPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.currentTarget.value);
  };
  const onPriceBlur = (e: FormEvent<HTMLInputElement>) => {
    let newPrice = parseFloat(e.currentTarget.value);
    if (isNaN(newPrice)) newPrice = 0;
    setPrice(newPrice.toFixed(2));
    setItems((old) => {
      const i = old.findIndex((i) => i.id === itemId);
      if (i < 0) return old;
      old[i] = { ...old[i], price: newPrice };
      return [...old];
    });
  };

  // ITEMS
  const [items, setItems] = useState<Item[]>([{ id: 0, price: 0, users: [] }]);
  const [itemId, setItemId] = useState(0);
  const item = items.find((i) => i.id === itemId);
  const nextItemId = useMemo(() => {
    for (let i = 0; true; i++) {
      if (items[i]) continue;
      return i;
    }
  }, [items.length]);

  const onItemClick = (id: number) => {
    setItemId(id);
    inputPrice.current?.focus();
  };
  useEffect(() => {
    const newPrice = item?.price ?? 0;
    setPrice(newPrice.toFixed(2));
  }, [item]);
  const onNewItem = () => {
    setItems((old) => [...old, { id: nextItemId, price: 0, users: [] }]);
    setItemId(nextItemId);
    divList.current?.scroll({ top: divList.current.scrollHeight });
    inputPrice.current?.focus();
  };

  // USERS
  const users: User[] =
    process.env.NEXT_PUBLIC_USERS?.split(',').map(
      (name, id) => ({ id, name } as User)
    ) ?? [];

  const onUserClick = (id: number) => {
    setItems((old) => {
      const i = old.findIndex((i) => i.id === itemId);
      if (i < 0) return old;
      const oldUsers = old[i].users;
      if (oldUsers.includes(id)) {
        old[i] = { ...old[i], users: old[i].users.filter((u) => u !== id) };
        return [...old];
      }
      old[i] = { ...old[i], users: [...old[i].users, id] };
      return [...old];
    });
  };

  // TOTALS
  const total = useMemo(() => calculateTotal(items), [items]);
  const splits = useMemo(() => calculateSplits(items, users), [items, users]);
  const splitTotal = useMemo(() => calculateSplitTotal(splits), [splits]);

  return (
    <div className={css['receipt-split']}>
      <div className={css['receipt-total']}>
        {users.map((user) => (
          <p key={user.id}>
            {user.name}
            <br />${splits[user.id].toFixed(2)}
          </p>
        ))}
      </div>
      <div className={css['receipt-list']} ref={divList}>
        {items.map((item, index) => (
          <div
            className={`${css['receipt-list__item']} ${
              item.id === itemId && css['receipt-list__item--selected']
            }`}
            onClick={() => onItemClick(item.id)}
            key={item.id}
          >
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
        <div
          className={`${css['receipt-list__item']} ${css['receipt-list__item--new']}`}
          onClick={onNewItem}
        >
          <p>Tap to add Item</p>
        </div>
      </div>
      <div className={css['receipt-total']}>
        <p>Split-Total: ${splitTotal.toFixed(2)}</p>
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <div className={css['receipt-split__input']}>
        <input
          type="number"
          value={price}
          onChange={onPriceChange}
          onBlur={onPriceBlur}
          ref={inputPrice}
        />
      </div>
      <div className={css['receipt-split__assign']}>
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserClick(user.id)}
            className={`${css['receipt-split__assign__button']} ${
              item?.users.includes(user.id) &&
              css['receipt-split__assign__button--selected']
            }`}
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
  );
};
export default ReceiptSplit;
