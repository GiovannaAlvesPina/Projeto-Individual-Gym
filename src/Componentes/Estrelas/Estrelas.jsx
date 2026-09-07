import styles from "./Estrelas.module.css";

function Estrelas({ nota = 0, aoEscolher, somenteLeitura = false }) {
  const valores = [1, 2, 3, 4, 5];

  return (
    <div className={styles.grupo}>
      {valores.map((valor) => (
        <button
          key={valor}
          type="button"
          className={valor <= Math.round(nota) ? styles.cheia : styles.vazia}
          disabled={somenteLeitura}
          onClick={() => aoEscolher && aoEscolher(valor)}
          aria-label={`Avaliar com ${valor} estrelas`}
        >
          ★
        </button>
      ))}

      {somenteLeitura && <span className={styles.nota}>{nota.toFixed(1)}</span>}
    </div>
  );
}

export default Estrelas;