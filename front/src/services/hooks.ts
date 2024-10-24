import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook
} from 'react-redux';
import { useMemo } from 'react';
import { AppDispatch, AppThunk, RootState } from '../types/types';
import { TState } from './reducers/store';
import { useSelector } from 'react-redux';

// Теперь этот хук знает структуру хранилища
// export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Хук не даст отправить экшен, который ему не знаком
export const useDispatch = () => dispatchHook<AppDispatch & AppThunk>(); 

// Хук для вытаскивания переменных из хранилища
// Если не обернуть в Memo то будет предупреждение о создании новой ссылки при каждом обращении
// и предлагается мемоизировать селекторы
export const useStore = <K extends keyof TState>(...keys: K[]) => {
  const storeSlice = useSelector((state: { store: TState }) => state.store);

  return useMemo(() => {
    return keys.reduce((result, key) => {
      result[key] = storeSlice[key];
      return result;
    }, {} as Pick<TState, K>);
  }, [storeSlice, ...keys]);
};

