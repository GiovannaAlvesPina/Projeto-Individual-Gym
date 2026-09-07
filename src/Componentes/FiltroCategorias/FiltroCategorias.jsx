import { CATEGORIAS } from "../../dados/opcoes";
import styles from "./FiltroCategorias.module.css";

function FiltroCategorias({ ativa, aoTrocar }) {
  return (
    <div className={styles.filtros}>
      <button
        className={ativa === "TODAS" ? styles.chipAtivo : styles.chip}
        onClick={() => aoTrocar("TODAS")}
      >
        Todas
      </button>

      {CATEGORIAS.map((categoria) => (
        <button
          key={categoria.valor}
          className={ativa === categoria.valor ? styles.chipAtivo : styles.chip}
          onClick={() => aoTrocar(categoria.valor)}
        >
          {categoria.texto}
        </button>
      ))}
    </div>
  );
}

export default FiltroCategorias;