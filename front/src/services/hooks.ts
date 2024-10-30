import {
  useDispatch as dispatchHook
} from 'react-redux';
import { AppDispatch, AppThunk } from '../types/types';
import { TState } from './reducers/store';
import { useSelector,shallowEqual } from 'react-redux';

// Теперь этот хук знает структуру хранилища
// export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Хук не даст отправить экшен, который ему не знаком
export const useDispatch = () => dispatchHook<AppDispatch & AppThunk>(); 

// Хук для вытаскивания переменных из хранилища
// Если не обернуть в Memo то будет предупреждение о создании новой ссылки при каждом обращении
// и предлагается мемоизировать селекторы
export const useStore = <K extends keyof TState>(...keys: K[]) => {
  const selectedSlice = useSelector(
    (state: { store: TState }) => {
      return keys.reduce((result, key) => {
        result[key] = state.store[key];
        return result;
      }, {} as Pick<TState, K>);
    },
    shallowEqual
  );

  return selectedSlice;
};

