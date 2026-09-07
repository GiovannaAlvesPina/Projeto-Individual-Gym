import styles from "./Botao.module.css";

function Botao({ children, carregando = false, variacao = "primario", ...resto }) {
  return (
    <button
      className={`${styles.botao} ${styles[variacao]}`}
      disabled={carregando}
      {...resto}
    >
      {carregando ? "Aguarde..." : children}
    </button>
  );
}

export default Botao;