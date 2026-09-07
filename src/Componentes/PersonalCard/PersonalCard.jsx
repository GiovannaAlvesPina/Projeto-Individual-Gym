import Estrelas from "../Estrelas/Estrelas";
import styles from "./PersonalCard.module.css";

function PersonalCard({ personal, aoContratar, contratado }) {
  return (
    <article className={styles.cartao}>
      <img
        className={styles.foto}
        src={personal.fotoUrl}
        alt={`Foto de ${personal.nome}`}
      />

      <div className={styles.info}>
        <h3 className={styles.nome}>{personal.nome}</h3>
        <p className={styles.detalhe}>
          {personal.anosExperiencia} anos de experiência · {personal.modalidade}
        </p>
        <p className={styles.descricao}>{personal.descricao}</p>
        <Estrelas nota={personal.mediaEstrelas || 0} somenteLeitura />
      </div>

      <button
        className={contratado ? styles.contratado : styles.contratar}
        onClick={() => aoContratar(personal)}
        disabled={contratado}
      >
        {contratado ? "Contratado" : "Contratar"}
      </button>
    </article>
  );
}

export default PersonalCard;