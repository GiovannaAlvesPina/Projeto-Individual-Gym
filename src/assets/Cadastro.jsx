import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cadastrarUsuario } from "../../servicos/api";
import { useSessao } from "../../contextos/SessaoContext";
import Campo from "../../components/Campo/Campo";
import Aviso from "../../components/Aviso/Aviso";
import styles from "./Cadastro.module.css";

const VAZIO = {
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  dataNascimento: "",
  tipo: "ALUNO",
};

function Cadastro() {
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const { login } = useSessao();
  const navegar = useNavigate();

  function aoDigitar(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
    setErro("");
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    if (!form.nome.trim() || !form.email.trim() || form.senha.length < 6) {
      setErro("Preencha nome, e-mail e uma senha de ao menos 6 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      const criado = await cadastrarUsuario(form);
      login(criado);
      navegar(criado.tipo === "PERSONAL" ? "/personal/perfil" : "/aluno");
    } catch (problema) {
      setErro(problema.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className={styles.cartao}>
      <h1 className={styles.titulo}>Criar conta</h1>

      <div className={styles.seletor}>
        <button
          type="button"
          className={form.tipo === "ALUNO" ? styles.ativo : styles.inativo}
          onClick={() => setForm((a) => ({ ...a, tipo: "ALUNO" }))}
        >
          Sou aluno
        </button>
        <button
          type="button"
          className={form.tipo === "PERSONAL" ? styles.ativo : styles.inativo}
          onClick={() => setForm((a) => ({ ...a, tipo: "PERSONAL" }))}
        >
          Sou personal
        </button>
      </div>

      <form onSubmit={aoEnviar}>
        <Campo rotulo="Nome" name="nome" value={form.nome} onChange={aoDigitar} />
        <Campo rotulo="E-mail" name="email" tipo="email" value={form.email} onChange={aoDigitar} />
        <Campo rotulo="Senha" name="senha" tipo="password" value={form.senha} onChange={aoDigitar} />
        <Campo rotulo="Telefone" name="telefone" value={form.telefone} onChange={aoDigitar} />
        <Campo
          rotulo="Data de nascimento"
          name="dataNascimento"
          tipo="date"
          value={form.dataNascimento}
          onChange={aoDigitar}
        />

        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <p className={styles.rodape}>
        Já tem conta? <Link to="/">Entrar</Link>
      </p>
    </section>
  );
}

export default Cadastro;