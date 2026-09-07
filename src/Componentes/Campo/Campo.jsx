import styles from "./Campo.module.css";

function Campo({ rotulo, name, value, onChange, tipo = "text", opcoes, erro, ...resto }) {
  const classe = erro ? `${styles.controle} ${styles.invalido}` : styles.controle;

  return (
    <label className={styles.campo}>
      <span className={styles.rotulo}>{rotulo}</span>

      {opcoes ? (
        <select className={classe} name={name} value={value} onChange={onChange}>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.texto}
            </option>
          ))}
        </select>
      ) : tipo === "textarea" ? (
        <textarea
          className={classe}
          name={name}
          value={value}
          onChange={onChange}
          rows={4}
          {...resto}
        />
      ) : (
        <input
          className={classe}
          type={tipo}
          name={name}
          value={value}
          onChange={onChange}
          {...resto}
        />
      )}

      {erro && <span className={styles.mensagemErro}>{erro}</span>}
    </label>
  );
}

export default Campo;