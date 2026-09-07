import styles from "./Carregando.module.css";

function Carregando({ texto = "Carregando..." }) {
  return <p className={styles.carregando}>{texto}</p>;
}

export default Carregando;