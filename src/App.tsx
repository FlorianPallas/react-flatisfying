import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Session, SessionContext } from './context/sessionContext';
import { useCallback, useEffect, useState } from 'react';
import { Group, GroupsService, User, UsersService } from './lib/openapi';

import IndexRoute from './routes';
import ExpensesRoute from './routes/expenses';
import ExpensesScanRoute from './routes/expenses/scan';
import Layout from './Layout';
import ExpensesEditRoute from './routes/expenses/new';

const App = () => {
  const [user, setUser] = useState<User>();
  const [group, setGroup] = useState<Group>();

  const setUserId = useCallback((userId: number) => {
    return UsersService.getUser(1).then(setUser);
  }, []);

  const setGroupId = useCallback((groupId: number) => {
    return GroupsService.getGroup(1).then(setGroup);
  }, []);

  useEffect(() => {
    setUserId(1);
    setGroupId(1);
  }, []);

  const session: Session = {
    user,
    setUserId,
    group,
    setGroupId,
    fetchGroup: () => GroupsService.getGroup(1).then(setGroup),
  };

  return (
    <SessionContext.Provider value={session}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<IndexRoute />} />
            <Route path="/expenses">
              <Route index element={<ExpensesRoute />} />
              <Route path="/expenses/scan" element={<ExpensesScanRoute />} />
            </Route>
            <Route path="*" element={<p>404</p>} />
          </Route>
          <Route path="/expenses/:id" element={<ExpensesEditRoute />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
};
export default App;
