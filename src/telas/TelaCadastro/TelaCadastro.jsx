import { useState } from "react";
import Campo from "../../Componentes/Campo/Campo";
import Botao from "../../Componentes/Botao/Botao";
import Aviso from "../../Componentes/Aviso/Aviso";
import styles from "./TelaCadastro.module.css";

const VAZIO = {
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  dataNascimento: "",
  tipo: "ALUNO",
};

function validar(form) {
  const erros = {};

  if (form.nome.trim().length < 3) {
    erros.nome = "Informe seu nome completo.";
  }

  if (!form.email.includes("@")) {
    erros.email = "O e-mail precisa conter @.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    erros.email = "E-mail inválido. Exemplo: nome@email.com";
  }

  if (form.senha.length < 8) {
    erros.senha = "A senha precisa ter no mínimo 8 caracteres.";
  } else if (!/[0-9]/.test(form.senha)) {
    erros.senha = "A senha precisa ter ao menos um número.";
  }

  if (form.telefone && form.telefone.replace(/\D/g, "").length < 10) {
    erros.telefone = "Telefone incompleto.";
  }

  if (!form.dataNascimento) {
    erros.dataNascimento = "Informe sua data de nascimento.";
  }

  return erros;
}

function TelaCadastro({ aoCadastrar, aoIrParaLogin }) {
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

  function escolherTipo(tipo) {
    setForm((anterior) => ({ ...anterior, tipo }));
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    const encontrados = validar(form);

    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      return;
    }

    setEnviando(true);

    try {
      await aoCadastrar(form);
    } catch (problema) {
      setErroGeral(problema.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.area}>
      <div className={styles.cartao}>
        <h1 className={styles.titulo}>Criar conta</h1>

        <div className={styles.seletor}>
          <button
            type="button"
            className={form.tipo === "ALUNO" ? styles.opcaoAtiva : styles.opcao}
            onClick={() => escolherTipo("ALUNO")}
          >
            Sou aluno
          </button>
          <button
            type="button"
            className={form.tipo === "PERSONAL" ? styles.opcaoAtiva : styles.opcao}
            onClick={() => escolherTipo("PERSONAL")}
          >
            Sou personal
          </button>
        </div>

        <form onSubmit={aoEnviar} noValidate>
          <Campo
            rotulo="Nome"
            name="nome"
            value={form.nome}
            onChange={aoDigitar}
            erro={erros.nome}
          />
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
          <Campo
            rotulo="Telefone"
            name="telefone"
            value={form.telefone}
            onChange={aoDigitar}
            erro={erros.telefone}
          />
          <Campo
            rotulo="Data de nascimento"
            name="dataNascimento"
            tipo="date"
            value={form.dataNascimento}
            onChange={aoDigitar}
            erro={erros.dataNascimento}
          />

          <Botao type="submit" carregando={enviando}>
            Criar conta
          </Botao>
        </form>

        {erroGeral && <Aviso tipo="erro">{erroGeral}</Aviso>}

        <p className={styles.rodape}>
          Já tem conta?{" "}
          <button className={styles.troca} onClick={aoIrParaLogin}>
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}

export default TelaCadastro;