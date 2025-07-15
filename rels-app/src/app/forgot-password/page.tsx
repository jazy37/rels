import styles from './page.module.css';

export default function ForgotPassword() {
  return (
    <div className={styles.forgotPage}>
      <div className={styles.forgotContainer}>
        <div className={styles.forgotCard}>
          <div className={styles.forgotHeader}>
            <h1 className={styles.forgotTitle}>Zapomniałeś hasła?</h1>
            <p className={styles.forgotSubtitle}>
              Wprowadź swój adres email, a wyślemy Ci link do resetowania hasła
            </p>
          </div>
          
          <form className={styles.forgotForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                Adres email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                placeholder="wprowadź swój email"
                required
              />
            </div>
            
            <button type="submit" className={styles.resetButton}>
              Wyślij link resetujący
            </button>
          </form>
          
          <div className={styles.forgotFooter}>
            <p className={styles.backText}>
              Pamiętasz hasło?{' '}
              <a href="/login" className={styles.backLink}>
                Wróć do logowania
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}