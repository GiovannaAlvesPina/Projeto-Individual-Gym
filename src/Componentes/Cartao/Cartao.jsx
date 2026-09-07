import styles from "./Cartao.module.css";

function Cartao({ titulo, children }) {
  return (
    <section className={styles.cartao}>
      {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
      {children}
    </section>
  );
}

export default Cartao;