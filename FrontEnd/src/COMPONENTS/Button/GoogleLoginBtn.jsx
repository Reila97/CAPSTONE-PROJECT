import { Button, Spinner } from 'react-bootstrap';
import { Google } from 'react-bootstrap-icons'; // Assicurati di avere react-bootstrap-icons o usa un SVG
import './GoogleLoginBtn.css';

/**
 * @param {Function} onClick - La funzione di gestione del login
 * @param {Boolean} isLoading - Stato di caricamento
 */
function GoogleLoginBtn({ onClick, isLoading }) {
  return (
    <Button
      type="button"
      variant="light"
      className="google-auth-btn d-flex align-items-center justify-content-center w-100 shadow-sm border"
      onClick={onClick}
      disabled={isLoading}
      aria-label="Accedi con Google"
    >
      {isLoading ? (
        <>
          <Spinner 
            animation="border" 
            size="sm" 
            variant="dark" 
            className="me-2" 
            role="status"
            aria-hidden="true"
          />
          <span className="btn-text">Verifica in corso...</span>
        </>
      ) : (
        <>
          <Google className="me-2 text-primary" size={18} />
          <span className="btn-text fw-bold">Accedi con Google</span>
        </>
      )}
    </Button>
  );
}

export default GoogleLoginBtn;
