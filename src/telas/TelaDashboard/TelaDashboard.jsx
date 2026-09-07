import Cartao from "../../Componentes/Cartao/Cartao";
import Estrelas from "../../Componentes/Estrelas/Estrelas";
import Carregando from "../../Componentes/Carregando/Carregando";
import Aviso from "../../Componentes/Aviso/Aviso";
import styles from "./TelaDashboard.module.css";

function TelaDashboard({ planos, alunos, avaliacoes, carregando, erro }) {
  if (carregando) return <Carregando texto="Montando sua dashboard..." />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;

  const notas = avaliacoes.map((avaliacao) => avaliacao.estrelas);
  const media = notas.length
    ? notas.reduce((total, nota) => total + nota, 0) / notas.length
    : 0;

  return (
    <>
      <div className={styles.indicadores}>
        <div className={styles.indicador}>
          <p className={styles.rotulo}>Alunos ativos</p>
          <p className={styles.numero}>{alunos.length}</p>
        </div>

        <div className={styles.indicador}>
          <p className={styles.rotulo}>Planos cadastrados</p>
          <p className={styles.numero}>{planos.length}</p>
        </div>

        <div className={styles.indicador}>
          <p className={styles.rotulo}>Média de estrelas</p>
          <Estrelas nota={media} somenteLeitura />
          <p className={styles.rotulo}>{notas.length} avaliações</p>
        </div>
      </div>

      <Cartao titulo="Alunos que contrataram">
        {alunos.length === 0 ? (
          <p className={styles.vazio}>Nenhum aluno contratou você ainda.</p>
        ) : (
          <ul className={styles.lista}>
            {alunos.map((contratacao) => (
              <li key={contratacao.id} className={styles.item}>
                <span>{contratacao.alunoNome}</span>
                <span className={styles.data}>desde {contratacao.dataInicio}</span>
              </li>
            ))}
          </ul>
        )}
      </Cartao>
    </>
  );
}

export default TelaDashboard;