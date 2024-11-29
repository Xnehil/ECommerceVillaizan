import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SidebarContextType {
  pendingOrders: number;
  setPendingOrders: React.Dispatch<React.SetStateAction<number>>;
  decrementPendingOrders: () => void;
  incrementPendingOrders: () => void;
  unreadNotifications: number;
  setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>;
  decrementNotificaciones: () => void;
  incrementNotificaciones: () => void;
  refreshOrders: boolean;
  setRefreshOrders: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [refreshOrders, setRefreshOrders] = useState<boolean>(false);

  const decrementPendingOrders = () => {
    setPendingOrders((prev) => Math.max(prev - 1, 0));
  };

  const incrementPendingOrders = () => {
    setPendingOrders((prev) => prev + 1);
  };

  const decrementNotificaciones = () => {
    setUnreadNotifications((prev) => Math.max(prev - 1, 0));
  };

  const incrementNotificaciones = () => {
    setUnreadNotifications((prev) => prev + 1);
  }

  return (
    <SidebarContext.Provider value={{ pendingOrders, setPendingOrders, decrementPendingOrders, incrementPendingOrders, unreadNotifications, setUnreadNotifications, decrementNotificaciones, incrementNotificaciones, refreshOrders, setRefreshOrders }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook for easy access
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};