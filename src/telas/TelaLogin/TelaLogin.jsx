import { useState } from "react";
import Campo from "../../Componentes/Campo/Campo";
import Botao from "../../Componentes/Botao/Botao";
import Aviso from "../../Componentes/Aviso/Aviso";
import styles from "./TelaLogin.module.css";

const VAZIO = { email: "", senha: "" };

function TelaLogin({ aoEntrar, aoIrParaCadastro }) {
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");

  function aoDigitar(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
    setErros((anterior) => ({ ...anterior, [name]: "" }));
    setErroGeral("");
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    const encontrados = {};

    if (!form.email.includes("@")) {
      encontrados.email = "O e-mail precisa conter @.";
    }

    if (!form.senha) {
      encontrados.senha = "Informe sua senha.";
    }

    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      return;
    }

    setEnviando(true);

    try {
      await aoEntrar(form);
    } catch (problema) {
      setErroGeral(problema.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.area}>
      <div className={styles.cartao}>
        <h1 className={styles.titulo}>Entrar</h1>
        <p className={styles.subtitulo}>Acesse sua conta de personal ou aluno.</p>

        <form onSubmit={aoEnviar} noValidate>
          <Campo
            rotulo="E-mail"
            name="email"
            tipo="email"
            value={form.email}
            onChange={aoDigitar}
            erro={erros.email}
          />
          <Campo
            rotulo="Senha"
            name="senha"
            tipo="password"
            value={form.senha}
            onChange={aoDigitar}
            erro={erros.senha}
          />

          <Botao type="submit" carregando={enviando}>
            Entrar
          </Botao>
        </form>

        {erroGeral && <Aviso tipo="erro">{erroGeral}</Aviso>}

        <p className={styles.rodape}>
          Ainda não tem conta?{" "}
          <button className={styles.troca} onClick={aoIrParaCadastro}>
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
}

export default TelaLogin;