import styles from "./TelaInicial.module.css";

const DESTAQUES = [
  {
    titulo: "Planos por objetivo",
    texto: "Emagrecimento, hipertrofia, condicionamento ou reabilitação.",
  },
  {
    titulo: "Personal de verdade",
    texto: "Escolha pelo perfil, experiência e avaliação de outros alunos.",
  },
  {
    titulo: "Online ou presencial",
    texto: "Treine na academia ou onde você estiver.",
  },
];

function TelaInicial({ aoEntrar, aoCriarConta }) {
  return (
    <div className={styles.area}>
      <div className={styles.conteudo}>
        <p className={styles.marca}>Academia</p>

        <h1 className={styles.chamada}>Seu treino, montado por quem entende.</h1>

        <p className={styles.texto}>
          Conecte-se a personal trainers, receba planos de treino sob medida e
          acompanhe sua evolução.
        </p>

        <div className={styles.acoes}>
          <button className={styles.principal} onClick={aoCriarConta}>
            Criar conta
          </button>
          <button className={styles.secundario} onClick={aoEntrar}>
            Já tenho conta
          </button>
        </div>

        <div className={styles.destaques}>
          {DESTAQUES.map((destaque) => (
            <article key={destaque.titulo} className={styles.destaque}>
              <h2 className={styles.destaqueTitulo}>{destaque.titulo}</h2>
              <p className={styles.destaqueTexto}>{destaque.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TelaInicial;