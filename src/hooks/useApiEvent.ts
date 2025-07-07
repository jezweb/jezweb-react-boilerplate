import { useEffect, useCallback } from 'react';
import { useApiEventStore, ApiEvent, ApiEventStatus, ApiEventType } from '../stores/api-event.store';

interface EventHandlers {
  [key: string]: (event: ApiEvent) => void;
}

export const useApiEvent = (handlers?: EventHandlers) => {
  const apiEventStore = useApiEventStore();

  const createEventStatusHandleMap = useCallback(
    (apiEvent: ApiEvent): { [key in ApiEventStatus]?: () => void } => {
      return {
        [ApiEventStatus.COMPLETED]: () => {
          if (apiEvent.toast && apiEvent.message) {
            // You would integrate with your toast system here
            console.log('Success:', apiEvent.message);
          }
          
          if (handlers?.[apiEvent.type]) {
            handlers[apiEvent.type](apiEvent);
          }
        },
        [ApiEventStatus.ERROR]: () => {
          if (apiEvent.toast && apiEvent.message) {
            // You would integrate with your toast system here
            console.error('Error:', apiEvent.message);
          }
          
          if (handlers?.[apiEvent.type]) {
            handlers[apiEvent.type](apiEvent);
          }
        },
        [ApiEventStatus.IN_PROGRESS]: () => {
          if (handlers?.[apiEvent.type]) {
            handlers[apiEvent.type](apiEvent);
          }
        },
        [ApiEventStatus.DEFAULT]: () => {
          if (handlers?.[apiEvent.type]) {
            handlers[apiEvent.type](apiEvent);
          }
        },
      };
    },
    [handlers]
  );

  useEffect(() => {
    const unsubscribe = apiEventStore.subscribe((event) => {
      if (!event) return;
      
      const eventStatusHandleMap = createEventStatusHandleMap(event);
      const handleEvent = eventStatusHandleMap[event.status] || (() => {});
      handleEvent();
    });
    
    return () => {
      unsubscribe();
    };
  }, [apiEventStore, createEventStatusHandleMap]);

  return {
    sendEvent: apiEventStore.sendEvent,
    currentEvent: apiEventStore.currentEvent,
  };
};