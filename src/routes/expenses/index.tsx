import { useCallback, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Balance from '../../components/Balance';
import Purchases from '../../components/Purchases';
import { PurchasesService } from '../../lib/openapi';
import { ReactComponent as AddIcon } from '@material-design-icons/svg/round/add.svg';
import { SessionContext } from '../../context/sessionContext';

const ExpensesRoute = () => {
  const navigate = useNavigate();
  const { fetchGroup } = useContext(SessionContext);

  useEffect(() => {
    fetchGroup();
  }, []);

  const onAddClick = useCallback(() => {
    PurchasesService.createPurchase({
      name: 'Untitled Expense',
      price: 0.0,
    }).then((expense) => navigate(`/expenses/${expense.id}`));
  }, [navigate]);

  return (
    <main className="p-5">
      <section className="mb-5">
        <div className="flex justify-between items-center mb-5">
          <p className="text-2xl">Balance</p>
        </div>
        <Balance />
      </section>
      <section>
        <div className="flex justify-between items-center mb-5">
          <p className="text-2xl">Purchases</p>
          <button
            onClick={onAddClick}
            className="bg-gray-800 rounded-full p-0.5"
          >
            <AddIcon className="fill-white h-6 w-6" />
          </button>
        </div>
        <Purchases />
      </section>
    </main>
  );
};
export default ExpensesRoute;
