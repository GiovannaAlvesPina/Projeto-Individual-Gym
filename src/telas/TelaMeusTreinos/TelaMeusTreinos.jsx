import PlanoCard from "../../Componentes/PlanoCard/PlanoCard";
import Carregando from "../../Componentes/Carregando/Carregando";
import Aviso from "../../Componentes/Aviso/Aviso";
import styles from "./TelaMeusTreinos.module.css";

function TelaMeusTreinos({
  personal,
  planos,
  minhasNotas,
  carregando,
  erro,
  aoAvaliar,
}) {
  if (carregando) return <Carregando texto="Carregando seus treinos..." />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;

  if (!personal) {
    return (
      <p className={styles.vazio}>
        Você ainda não contratou um personal. Vá em Personais e escolha um.
      </p>
    );
  }

  return (
    <>
      <div className={styles.topo}>
        <img className={styles.foto} src={personal.fotoUrl} alt={personal.nome} />
        <div>
          <h1 className={styles.nome}>{personal.nome}</h1>
          <p className={styles.detalhe}>
            {personal.anosExperiencia} anos de experiência · {personal.modalidade}
          </p>
        </div>
      </div>

      {planos.length === 0 ? (
        <p className={styles.vazio}>Seu personal ainda não publicou planos.</p>
      ) : (
        <div className={styles.grade}>
          {planos.map((plano) => (
            <PlanoCard
              key={plano.id}
              plano={plano}
              notaDoAluno={minhasNotas[plano.id]}
              aoAvaliar={aoAvaliar}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default TelaMeusTreinos;