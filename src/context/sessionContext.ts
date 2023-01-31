import { createContext } from 'react';
import { Group, User } from '../lib/openapi';

export interface Session {
  user?: User;
  setUserId: (userId: number) => void;
  group?: Group;
  setGroupId: (groupId: number) => void;
  fetchGroup: () => void;
}

export const SessionContext = createContext<Session>({} as Session);
