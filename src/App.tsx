import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Avatar from './components/Avatar';
import InputCurrency from './components/InputCurrency';
import { useLocalStorage } from './hooks/useLocalStorage';
import { parseCurrencyString, toCurrencyString } from './lib/localization';
import { useArrayState } from './hooks/useArrayState';

interface User {
  id: string;
  name: string;
}

const users: User[] = [
  { id: '1', name: 'Florian' },
  { id: '2', name: 'Lukas' },
  { id: '3', name: 'Juli' },
  { id: '4', name: 'Nicolas' },
];

interface ReceiptItem {
  name?: string;
  quantity?: number;
  price: number;
  userIds: string[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

export default function ReceiptRoute() {
  const inputCurrency = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const receipt = useArrayState<ReceiptItem>();
  const storedReceipt = useLocalStorage(
    'receipt',
    receipt.items,
    receipt.setAll
  );

  const [selectedIndex, select] = useState<number>();
  const selectedItem = useMemo(
    () =>
      selectedIndex !== undefined ? receipt.items[selectedIndex] : undefined,
    [selectedIndex, receipt.items]
  );

  useEffect(() => {
    if (!inputCurrency.current || !selectedItem) return;
    inputCurrency.current.value = toCurrencyString(selectedItem.price, true);
  }, [selectedItem]);

  const toggleUser = (id: string) => {
    if (selectedIndex === undefined) return;
    receipt.update(selectedIndex, (item) => {
      if (item.userIds.includes(id)) {
        item.userIds = item.userIds.filter((i) => i !== id);
      } else {
        item.userIds.push(id);
      }
    });
  };

  const selectItem = (id: number) => {
    select(id);
    inputCurrency.current?.focus();
  };

  const addItem = () => {
    receipt.add({ price: 0, userIds: [] });
    selectItem(receipt.items.length);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearItems = () => {
    if (!confirm('Are you sure you want to delete all entries?')) return;
    receipt.removeAll();
    storedReceipt.forget();
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (selectedIndex === undefined) return;
    const value = parseCurrencyString(event.currentTarget.value);
    receipt.update(selectedIndex, (item) => (item.price = value));
  };

  const total = useMemo(() => {
    let sum = 0;
    for (const item of Object.values(receipt.items)) {
      sum += item.price;
    }
    return sum;
  }, [receipt.items]);

  const shares = useMemo(() => {
    const shareMap: { [key: string]: number } = {};

    for (const item of Object.values(receipt.items)) {
      if (item.userIds.length < 1) continue;

      const sharePrice = item.price / item.userIds.length;

      for (const id of item.userIds) {
        if (shareMap[id] === undefined) shareMap[id] = 0;
        shareMap[id] += sharePrice;
      }
    }

    return shareMap;
  }, [receipt.items]);

  const shareTotal = useMemo(() => {
    let sum = 0;
    for (const share of Object.values(shares)) {
      sum += share;
    }
    return sum;
  }, [shares]);

  return (
    <div className="flex flex-col">
      <ul className="min-h-0 flex-grow space-y-2 overflow-y-scroll p-5 pb-52">
        <li className="flex justify-between rounded bg-gray-800 p-5">
          <div className="flex flex-col items-start">
            <p className="text-sm font-bold">Total:</p>
            <p>{formatCurrency(total)}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-bold">Share-Total:</p>
            <p>{formatCurrency(shareTotal)}</p>
          </div>
        </li>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between rounded bg-gray-800 p-5"
          >
            <div className="flex">
              <Avatar name={user?.name ?? ''} className="h-6" />
              <p className="ml-2">{user?.name}</p>
            </div>
            <p>{formatCurrency(shares[user.id] ?? 0)}</p>
          </li>
        ))}
        <li className="h-5"></li>
        {receipt.items.map((item, index) => (
          <li
            key={index}
            className={
              'flex justify-between rounded border-r-2 bg-gray-800 p-2 odd:bg-gray-700 ' +
              (selectedIndex === index ? 'outline outline-1 ' : '') +
              (item.userIds.length < 1 ? 'border-red-500' : 'border-gray-500')
            }
            onClick={() => selectItem(index)}
          >
            <p>
              {item.name ?? 'Item Name'}{' '}
              {(item.quantity ?? 1) > 1 ? `(x${item.quantity})` : ''}
            </p>
            <p>{formatCurrency(item.price)}</p>
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>
      <div
        className={
          'fixed bottom-0 bg-gray-800 pt-5 pb-10 '
        }
      >
        <InputCurrency
          ref={inputCurrency}
          className="w-full bg-transparent p-2 text-center text-3xl"
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addItem();
            }
          }}
        />
        <ul className="m-5 flex justify-center space-x-2">
          {users.map((user) => (
            <li
              key={user.id}
              className={
                'flex items-center rounded-full border p-0.5 pr-1.5 transition-colors ' +
                (selectedItem?.userIds.includes(user.id)
                  ? 'bg-white text-black'
                  : '')
              }
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={(e) => {
                e.preventDefault();
                toggleUser(user.id);
              }}
            >
              <Avatar name={user.name} className="h-5" />
              <p className="ml-1 text-xs">{user.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
