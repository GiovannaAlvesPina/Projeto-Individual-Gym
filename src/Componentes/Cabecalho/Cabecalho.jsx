import styles from "./Cabecalho.module.css";

const MENU_PERSONAL = [
  { tela: "dashboard", texto: "Dashboard" },
  { tela: "planos", texto: "Planos" },
  { tela: "perfil", texto: "Meu perfil" },
];

const MENU_ALUNO = [
  { tela: "personais", texto: "Personais" },
  { tela: "meus-treinos", texto: "Meus treinos" },
];

function Cabecalho({ usuario, telaAtual, aoNavegar, aoSair }) {
  const menu = usuario.tipo === "PERSONAL" ? MENU_PERSONAL : MENU_ALUNO;

  return (
    <header className={styles.cabecalho}>
      <div>
        <p className={styles.marca}>Academia Fit</p>
        <p className={styles.usuario}>
          {usuario.nome} · {usuario.tipo === "PERSONAL" ? "personal" : "aluno"}
        </p>
      </div>

      <nav className={styles.menu}>
        {menu.map((item) => (
          <button
            key={item.tela}
            className={telaAtual === item.tela ? styles.itemAtivo : styles.item}
            onClick={() => aoNavegar(item.tela)}
          >
            {item.texto}
          </button>
        ))}

        <button className={styles.sair} onClick={aoSair}>
          Sair
        </button>
      </nav>
    </header>
  );
}

export default Cabecalho;