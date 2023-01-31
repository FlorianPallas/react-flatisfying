import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import Avatar from '../../components/Avatar';
import InputCurrency from '../../components/InputCurrency';
import {
  Purchase,
  PurchasesService,
  ReceiptControllerService,
  User,
  UsersService,
} from '../../lib/openapi';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { toCurrencyString } from '../../lib/localization';
import { useNavigate, useParams } from 'react-router-dom';
import { useArrayState } from '../../hooks/useArrayState';
import { ReactComponent as DoneIcon } from '@material-design-icons/svg/round/done.svg';
import { ReactComponent as CloseIcon } from '@material-design-icons/svg/round/close.svg';

interface ReceiptItem {
  name?: string;
  quantity?: number;
  price: number;
  userIds: number[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

const ExpensesEditRoute: FC = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [purchase, setPurchase] = useState<Purchase>();
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    if (!id) return;
    PurchasesService.getPurchase(parseInt(id)).then(setPurchase);
    UsersService.getUsers().then(setUsers);
  }, []);

  const inputCurrency = useRef<HTMLInputElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLUListElement>(null);

  const receipt = useArrayState<ReceiptItem>();
  const storedReceipt = useLocalStorage(
    'receipt-editor',
    receipt.items,
    receipt.setAll
  );

  const [selectedIndex, select] = useState<number>();
  const selectedItem = useMemo(
    () => (selectedIndex !== undefined ? receipt.items[selectedIndex] : undefined),
    [selectedIndex]
  );

  useEffect(() => {
    if (!inputCurrency.current || !selectedItem) return;
    inputCurrency.current.value = toCurrencyString(selectedItem.price, true);
  }, [selectedItem]);

  const onInputFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length !== 1) return;
    var file = event.target.files[0];
    ReceiptControllerService.scanReceipt({ file }).then((items) =>
      receipt.addAll(
        items.map((i) => ({
          name: i.name,
          price: i.price ?? 0,
          userIds: [],
          quantity: i.quantity,
        }))
      )
    );
  };

  const toggleUser = (id: number) => {
    if (!selectedIndex) return;
    receipt.update(selectedIndex, (item) => {
      if (item.userIds.includes(id)) {
        item.userIds = item.userIds.filter((i) => i !== id);
      } else {
        item.userIds.push(id);
      }
    });
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value =
      parseInt(
        event.currentTarget.value.replaceAll(/[^0-9]/g, '').padStart(3, '0')
      ) / 100;
    if (selectedIndex === undefined) return;
    console.log(value);

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

  if (!users || !purchase) return <p>Loading...</p>;

  const getUser = (id: number) => users.find((user) => user.id === id);

  return (
    <div className="h-full flex flex-col">
      <nav className="bg-gray-800">
        <ul className="flex justify-between items-center">
          <li
            className="p-4"
            onClick={() => {
              storedReceipt.forget();
              navigate('/expenses');
            }}
          >
            <CloseIcon className="fill-white" />
          </li>
          <li>
            <p>Untitled Purchase</p>
          </li>
          <li
            className="p-4"
            onClick={() => {
              PurchasesService.updatePurchase(purchase.id, {
                price: total,
              }).then(() => navigate('/expenses'));
            }}
          >
            <DoneIcon className="fill-white" />
          </li>
        </ul>
      </nav>
      <ul
        className="p-5 space-y-2 overflow-y-scroll flex-grow"
        ref={containerRef}
      >
        {receipt.items.map((item, index) => (
          <li
            key={index}
            className={
              'bg-gray-800 odd:bg-gray-700 p-2 border-r-2 rounded flex justify-between ' +
              (selectedIndex === index ? 'outline outline-1 ' : '') +
              (item.userIds.length < 1 ? 'border-red-500' : 'border-gray-500')
            }
            onClick={() => select(index)}
          >
            <p>
              {item.name ?? 'Item Name'}{' '}
              {(item.quantity ?? 1) > 1 ? `(x${item.quantity})` : ''}
            </p>
            <p>{formatCurrency(item.price)}</p>
          </li>
        ))}
        <li className="h-5"></li>
        <li
          className={'bg-gray-500 p-2 rounded flex justify-center'}
          onClick={() => {
            receipt.add({ price: 0, userIds: [] });
            select(receipt.items.length);
          }}
        >
          Add
        </li>
        <li
          className={'bg-gray-500 p-2 rounded flex justify-center'}
          onClick={() => {
            inputFileRef.current?.click();
          }}
        >
          Scan
        </li>
        <li
          className={'bg-gray-500 p-2 rounded flex justify-center'}
          onClick={() => receipt.removeAll()}
        >
          Clear
        </li>
        <li className="h-5"></li>
        <li className="flex justify-between bg-gray-800 p-5 rounded">
          <p>Total: {formatCurrency(total)}</p>
          <p>Split Total: {formatCurrency(shareTotal)}</p>
        </li>
        {Object.entries(shares).map(([id, sum]) => {
          const user = getUser(parseInt(id));

          return (
            <li key={id} className="flex justify-between bg-gray-800 p-5 rounded">
              <div className="flex">
                <Avatar name={user?.name ?? ''} size={25} />
                <p key={id} className="ml-2">
                  {user?.name}
                </p>
              </div>
              <p>{formatCurrency(sum)}</p>
            </li>
          );
        })}
      </ul>
      <div className="bg-gray-800 pt-5">
        <InputCurrency
          ref={inputCurrency}
          className="p-2 text-3xl w-full bg-transparent text-center"
          locales={'de-DE'}
          onChange={onChange}
        />
        <ul className="flex justify-center space-x-2 m-5">
          {users.map((user) => (
            <li
              key={user.id}
              className={
                'flex items-center border rounded-full p-0.5 pr-1.5 transition-colors ' +
                (selectedItem?.userIds.includes(user.id)
                  ? 'bg-white text-black'
                  : '')
              }
              onClick={() => toggleUser(user.id)}
            >
              <Avatar name={user.name} size={20} />
              <p className="ml-1 text-xs">{user.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <input
        type="file"
        ref={inputFileRef}
        onChange={onInputFileChanged}
        hidden
      />
    </div>
  );
};
export default ExpensesEditRoute;
