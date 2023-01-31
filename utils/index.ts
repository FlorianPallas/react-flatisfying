import type { Item, Splits, User } from '~/types';

export const calculateTotal = (items: Item[]) => {
  let total = 0;
  for (const item of items) {
    total += item.price * 100;
  }
  return Math.ceil(total) / 100;
};

export const calculateSplitTotal = (splits: Splits) => {
  let total = 0;
  for (const userId in splits) {
    total += splits[userId] * 100;
  }
  return Math.ceil(total) / 100;
};

export const calculateSplits = (items: Item[], users: User[]) => {
  let splits: Splits = {};
  for (const user of users) {
    splits[user.id] = 0;
  }

  for (const item of items) {
    const part =
      item.users.length > 0
        ? Math.ceil((item.price * 100) / item.users.length)
        : item.price * 100;
    for (const userId of item.users) {
      splits[userId] += part;
    }
  }

  for (const user of users) {
    splits[user.id] = Math.ceil(splits[user.id]) / 100;
  }

  return splits;
};
