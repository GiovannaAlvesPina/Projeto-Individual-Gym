import Estrelas from "../Estrelas/Estrelas";
import styles from "./PlanoCard.module.css";

function PlanoCard({ plano, aoAbrir, notaDoAluno, aoAvaliar }) {
  return (
    <article className={styles.cartao}>
      <span className={styles.categoria}>{plano.categoria}</span>

      <h3 className={styles.titulo}>{plano.titulo}</h3>

      <p className={styles.detalhe}>
        {plano.nivel} · {plano.duracaoSemanas} semanas
      </p>

      {plano.descricao && <p className={styles.descricao}>{plano.descricao}</p>}

      {aoAvaliar && (
        <div className={styles.avaliacao}>
          <span className={styles.detalhe}>Sua avaliação</span>
          <Estrelas
            nota={notaDoAluno || 0}
            aoEscolher={(valor) => aoAvaliar(plano.id, valor)}
          />
        </div>
      )}

      {aoAbrir && (
        <button className={styles.link} onClick={() => aoAbrir(plano)}>
          Ver treinos
        </button>
      )}
    </article>
  );
}

export default PlanoCard;