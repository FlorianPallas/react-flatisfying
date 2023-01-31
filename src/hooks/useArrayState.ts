import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';

export const useArrayState = <T>() => {
  const [items, setAll] = useState<T[]>([]);

  const add = useCallback((item: T) => {
    setAll((oldItems) => [...cloneDeep(oldItems), item]);
  }, []);

  const addAll = useCallback((items: T[]) => {
    setAll((oldItems) => [...cloneDeep(oldItems), ...items]);
  }, []);

  const set = useCallback((index: number, item: T) => {
    setAll((oldItems) => {
      var newItems = cloneDeep(oldItems);
      newItems[index] = item;
      return newItems;
    });
  }, []);

  const update = useCallback((index: number, fn: (item: T) => void) => {
    setAll((oldItems) => {
      var newItems = cloneDeep(oldItems);
      fn(newItems[index]);
      return newItems;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setAll((oldItems) => {
      var newItems = cloneDeep(oldItems);
      newItems.splice(index, 1);
      return newItems;
    });
  }, []);

  const removeAll = useCallback(() => {
    setAll([]);
  }, []);

  return { items, set, setAll, add, addAll, update, remove, removeAll };
};
