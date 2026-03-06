export default function LoginLoader() {
  return (
    <div className="login-loader-overlay">
      <div className="login-loader-box">
        <img
          src="../assets/icons/logo.png"
          alt="System Logo"
          className="login-loader-logo"
        />
        <div className="login-loader-spinner"></div>
        <p className="login-loader-text">Signing you in...</p>
      </div>
    </div>
  );
}