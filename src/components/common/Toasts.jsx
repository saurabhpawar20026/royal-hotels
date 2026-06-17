import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { useNotify } from "../../context/NotificationContext.jsx";
import "./Toasts.css";

const ICON = { success: FaCheckCircle, info: FaInfoCircle, warning: FaExclamationTriangle, error: FaExclamationTriangle };

export default function Toasts() {
  const { toasts, dismissToast } = useNotify();
  return (
    <div className="toasts">
      {toasts.map((t) => {
        const Icon = ICON[t.type] || FaInfoCircle;
        return (
          <div key={t.id} className={`toast glass toast--${t.type}`} role="status">
            <Icon className="toast__icon" />
            <div className="toast__body">
              <strong>{t.title}</strong>
              {t.body && <p>{t.body}</p>}
            </div>
            <button className="toast__close" onClick={() => dismissToast(t.id)} aria-label="Dismiss"><FaTimes /></button>
          </div>
        );
      })}
    </div>
  );
}
