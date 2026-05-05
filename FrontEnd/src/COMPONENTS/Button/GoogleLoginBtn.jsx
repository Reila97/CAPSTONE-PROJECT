import { Button, Spinner } from 'react-bootstrap';
import './GoogleLoginBtn.css';

/**
 * @param {Function} onClick - La funzione passata dal componente Login
 * @param {Boolean} isLoading - Stato di caricamento per mostrare lo spinner
 */
function GoogleLoginBtn({ onClick, isLoading }) {
  return (
    <Button
      variant="light"
      className="google-auth-btn d-flex align-items-center justify-content-center w-100 shadow-sm"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner animation="border" size="sm" variant="warning" />
      ) : (
        <>
          <span className="btn-text">Accedi con Google</span>
        </>
      )}
    </Button>
  );
}

export default GoogleLoginBtn;

//TODO,non funziona il login con google