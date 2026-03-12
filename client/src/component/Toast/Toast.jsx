import { useContext } from "react";
import { context } from "../../../Context/context";
import "./toast.scss";

const Toast = () => {
  const { toasts, removeToast } = useContext(context);

  if (!toasts?.length) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-copy">{toast.message}</div>
          <button
            type="button"
            className="toast-close"
            aria-label="Close notification"
            onClick={() => removeToast(toast.id)}
          >
            <i className="bx bx-x"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
