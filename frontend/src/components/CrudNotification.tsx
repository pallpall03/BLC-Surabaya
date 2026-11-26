"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

type NotificationRole = "instruktur" | "koordinator";
type NotificationType = "success" | "error";

type CrudNotification = {
  type: NotificationType;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type CrudNotificationContextValue = {
  showNotification: (notification: CrudNotification) => void;
};

const ROLE_STYLES = {
  instruktur: {
    borderColor: "#fdba74",
    background: "#fff7ed",
    color: "#9a3412",
    boxShadow: "0 18px 44px rgb(234 88 12 / 16%)",
  },
  koordinator: {
    borderColor: "#93c5fd",
    background: "#eff6ff",
    color: "#1d4ed8",
    boxShadow: "0 18px 44px rgb(37 99 235 / 16%)",
  },
};

const ERROR_STYLE = {
  borderColor: "#fecaca",
  background: "#fef2f2",
  color: "#b91c1c",
  boxShadow: "0 18px 44px rgb(220 38 38 / 15%)",
};

const NOTIFICATION_STYLES = `
  .crud-notification {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 1500;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: min(390px, calc(100vw - 32px));
    padding: 16px;
    border: 1px solid transparent;
    border-radius: 14px;
    box-shadow: 0 18px 44px rgb(15 23 42 / 16%);
    animation: crud-notification-in 180ms ease-out;
  }
  .crud-notification__icon {
    display: inline-flex;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .crud-notification__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .crud-notification__title {
    font-size: 14px;
    font-weight: 750;
    line-height: 1.35;
  }
  .crud-notification__message {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  .crud-notification__action {
    align-self: flex-start;
    margin-top: 3px;
    padding: 0;
    border: 0;
    border-bottom: 1px solid currentColor;
    background: transparent;
    color: inherit;
    font-size: 12px;
    font-weight: 750;
    line-height: 1.5;
    cursor: pointer;
  }
  .crud-notification__action:hover {
    opacity: .75;
  }
  .crud-notification__close {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin: -4px -4px 0 0;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    opacity: .7;
    cursor: pointer;
  }
  .crud-notification__close:hover {
    background: rgb(15 23 42 / 6%);
    opacity: 1;
  }
  .crud-notification__close:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 1px;
  }
  @keyframes crud-notification-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 575.98px) {
    .crud-notification {
      right: 16px;
      bottom: 16px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .crud-notification {
      animation-duration: .01ms;
    }
  }
`;

const CrudNotificationContext = createContext<CrudNotificationContextValue | null>(null);

export function CrudNotificationProvider({
  children,
  role,
}: {
  children: ReactNode;
  role: NotificationRole;
}) {
  const [notification, setNotification] = useState<CrudNotification | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setNotification(null);
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const showNotification = useCallback((next: CrudNotification) => {
    if (timer.current) clearTimeout(timer.current);
    setNotification(next);
    timer.current = setTimeout(() => setNotification(null), next.type === "error" ? 7000 : 4500);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const value = useMemo(() => ({ showNotification }), [showNotification]);
  const isError = notification?.type === "error";

  return (
    <CrudNotificationContext.Provider value={value}>
      <style>{NOTIFICATION_STYLES}</style>
      {children}
      {notification && (
        <div
          className={`crud-notification crud-notification--${notification.type}`}
          data-notification-role={role}
          role={isError ? "alert" : "status"}
          aria-live={isError ? "assertive" : "polite"}
          aria-atomic="true"
          style={isError ? ERROR_STYLE : ROLE_STYLES[role]}
        >
          <span className="crud-notification__icon" aria-hidden="true">
            {isError ? <XCircle size={22} /> : <CheckCircle2 size={22} />}
          </span>
          <div className="crud-notification__content">
            <strong className="crud-notification__title">{notification.title}</strong>
            {notification.message && <span className="crud-notification__message">{notification.message}</span>}
            {notification.action && (
              <button
                type="button"
                className="crud-notification__action"
                onClick={() => {
                  dismiss();
                  notification.action?.onClick();
                }}
              >
                {notification.action.label}
              </button>
            )}
          </div>
          <button
            type="button"
            className="crud-notification__close"
            aria-label="Tutup notifikasi"
            onClick={dismiss}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </CrudNotificationContext.Provider>
  );
}

export function useCrudNotification() {
  const context = useContext(CrudNotificationContext);
  if (!context) {
    throw new Error("useCrudNotification harus digunakan di dalam CrudNotificationProvider.");
  }
  return context;
}
