// src/stores/zustand-ressetable-store.ts
import {create } from 'zustand';

// Define a type for the reset action
type ResettableState = {
  reset: () => void;
};

// Create a function to create a resettable store
export const createResettableStore = <T extends object>(
  initialState: Partial<T>,
  storeCreator: (set: any, get: any) => Partial<T>
) => {
  return create<T & ResettableState>()((set, get) => {
    const resetFn = () => {
      // When resetting, we need to preserve the methods from the current state
      const currentState = get();
      const methodsToKeep = {} as Partial<T>;
      
      // Extract methods from current state to preserve them
      Object.keys(currentState).forEach(key => {
        if (typeof currentState[key] === 'function' && key !== 'reset') {
          methodsToKeep[key as keyof T] = currentState[key];
        }
      });
      
      // Set state back to initial with preserved methods
      set({ 
        ...initialState, 
        ...methodsToKeep,
        reset: resetFn 
      } as T & ResettableState);
    };
    
    // Combine initial state, store creator methods, and reset function
    return {
      ...initialState,
      ...storeCreator(set, get),
      reset: resetFn
    } as T & ResettableState;
  });
};
