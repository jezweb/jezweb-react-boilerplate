import { create } from 'zustand';

type ResettableStore<T> = T & { reset: () => void };

export const createResettableStore = <T extends object>(
  initialState: T,
  storeCreator: (set: any, get: any, store: any) => T
) => {
  return create<ResettableStore<T>>()((set, get, store) => {
    const resetFn = () => {
      const currentState = get();
      const methodsToKeep = {} as Partial<T>;
      
      Object.keys(currentState).forEach(key => {
        if (typeof currentState[key as keyof typeof currentState] === 'function' && key !== 'reset') {
          methodsToKeep[key as keyof T] = currentState[key as keyof typeof currentState] as any;
        }
      });
      
      set({ ...initialState, ...methodsToKeep, reset: resetFn } as ResettableStore<T>);
    };
    
    return {
      ...initialState,
      ...storeCreator(set, get, store),
      reset: resetFn
    } as ResettableStore<T>;
  });
};