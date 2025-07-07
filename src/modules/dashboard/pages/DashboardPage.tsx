import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../../stores/user.store';
import { ApiEvent, ApiEventStatus, ApiEventType, useApiEventStore } from '@/stores/api-event.store';
import { User } from '@/models/user.model';

export const DashboardPage: React.FC = () => {

  const [user, setUser] = useState<User>(null);

  const apiEventStore = useApiEventStore();

  useEffect(() => {
    const unsubscribe = apiEventStore.subscribe((event) => {
              if (!event) return;
              // Use the factory pattern to handle different event statuses
              const eventStatusHandleMap = createEventStatusHandleMap(event);
              const handleEvent = eventStatusHandleMap[event.status] || (() => {});
              handleEvent();
            });
            return () => {
              unsubscribe(); 

            };
  }, []);

  const createEventStatusHandleMap = (
        apiEvent: ApiEvent, 
      ): { [key in ApiEventStatus]?: () => void } => {
        return {
          [ApiEventStatus.COMPLETED]: () => {
            // Event type handler map
            const eventTypeHandleMap: { [key in ApiEventType]?: () => void } = {
              [ApiEventType.LOGIN]: async () => {
                const userStore = useUserStore.getState();
                setUser(userStore.user);
              },
         
            };
            const handleEventType = eventTypeHandleMap[apiEvent.type] || (() => {});
            handleEventType();
          },
          [ApiEventStatus.ERROR]: () => { },
          [ApiEventStatus.IN_PROGRESS]: () => {
          },
          [ApiEventStatus.DEFAULT]: () => {
          }
        };
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to the Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Hello, {user?.firstName} {user?.lastName}!
        </p>
        <p className="text-gray-600">
          This is a protected area that requires authentication. You can navigate to different
          sections using the navigation menu above.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-gray-600">Manage application users</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">Configure your preferences</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <p className="text-gray-600">View analytics and reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};