import { create } from 'zustand';

export const createResettableStore = <T extends object>(
  initialState: Partial<T>,
  storeCreator: (set: any, get: any) => Partial<T>
) => {
  return create<T & { reset: () => void }>()((set, get) => {
    const resetFn = () => {
      const currentState = get();
      const methodsToKeep = {} as Partial<T>;
      
      Object.keys(currentState).forEach(key => {
        if (typeof currentState[key] === 'function' && key !== 'reset') {
          methodsToKeep[key as keyof T] = currentState[key];
        }
      });
      
      set({ ...initialState, ...methodsToKeep, reset: resetFn });
    };
    
    return {
      ...initialState,
      ...storeCreator(set, get),
      reset: resetFn
    };
  });
};