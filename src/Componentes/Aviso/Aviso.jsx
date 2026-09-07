import styles from "./Aviso.module.css";

function Aviso({ tipo = "erro", children }) {
  return (
    <p className={`${styles.aviso} ${styles[tipo]}`} role="status">
      {children}
    </p>
  );
}

export default Aviso;