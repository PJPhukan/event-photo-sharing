import "./loadingbutton.scss";

const LoadingButton = ({
  type = "button",
  className = "",
  loading = false,
  disabled = false,
  children,
  loadingText = "Loading...",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`loading-button ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="loading-button-content">
          <span className="loading-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
