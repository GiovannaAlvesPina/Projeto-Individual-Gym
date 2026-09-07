import { useState } from "react";
import Cartao from "../../Componentes/Cartao/Cartao";
import Campo from "../../Componentes/Campo/Campo";
import Botao from "../../Componentes/Botao/Botao";
import Aviso from "../../Componentes/Aviso/Aviso";
import Carregando from "../../Componentes/Carregando/Carregando";
import FiltroCategorias from "../../Componentes/FiltroCategorias/FiltroCategorias";
import PlanoCard from "../../Componentes/PlanoCard/PlanoCard";
import { CATEGORIAS, NIVEIS } from "../../dados/opcoes";
import styles from "./TelaPlanos.module.css";

const VAZIO = {
  titulo: "",
  categoria: "HIPERTROFIA",
  nivel: "INICIANTE",
  duracaoSemanas: "",
  objetivo: "",
  descricao: "",
};

function TelaPlanos({ planos, carregando, erroLista, aoCadastrar, aoAbrirPlano }) {
  const [form, setForm] = useState(VAZIO);
  const [filtro, setFiltro] = useState("TODAS");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function aoDigitar(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
    setErro("");
    setSucesso("");
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    if (!form.titulo.trim()) {
      setErro("Dê um título ao plano.");
      return;
    }

    if (!form.duracaoSemanas || Number(form.duracaoSemanas) < 1) {
      setErro("Informe a duração em semanas.");
      return;
    }

    setEnviando(true);

    try {
      await aoCadastrar({ ...form, duracaoSemanas: Number(form.duracaoSemanas) });
      setForm(VAZIO);
      setSucesso("Plano cadastrado.");
    } catch (problema) {
      setErro(problema.message);
    } finally {
      setEnviando(false);
    }
  }

  const visiveis =
    filtro === "TODAS" ? planos : planos.filter((plano) => plano.categoria === filtro);

  return (
    <div className={styles.layout}>
      <Cartao titulo="Novo plano de treino">
        <form onSubmit={aoEnviar}>
          <Campo rotulo="Título" name="titulo" value={form.titulo} onChange={aoDigitar} />
          <Campo
            rotulo="Categoria"
            name="categoria"
            value={form.categoria}
            onChange={aoDigitar}
            opcoes={CATEGORIAS}
          />
          <Campo
            rotulo="Nível"
            name="nivel"
            value={form.nivel}
            onChange={aoDigitar}
            opcoes={NIVEIS}
          />
          <Campo
            rotulo="Duração (semanas)"
            name="duracaoSemanas"
            tipo="number"
            min="1"
            value={form.duracaoSemanas}
            onChange={aoDigitar}
          />
          <Campo
            rotulo="Objetivo"
            name="objetivo"
            value={form.objetivo}
            onChange={aoDigitar}
          />
          <Campo
            rotulo="Descrição"
            name="descricao"
            tipo="textarea"
            value={form.descricao}
            onChange={aoDigitar}
          />

          <Botao type="submit" carregando={enviando}>
            Cadastrar plano
          </Botao>
        </form>

        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        {sucesso && <Aviso tipo="sucesso">{sucesso}</Aviso>}
      </Cartao>

      <section>
        <FiltroCategorias ativa={filtro} aoTrocar={setFiltro} />

        {carregando ? (
          <Carregando texto="Carregando planos..." />
        ) : erroLista ? (
          <Aviso tipo="erro">{erroLista}</Aviso>
        ) : visiveis.length === 0 ? (
          <p className={styles.vazio}>Nenhum plano nesta categoria.</p>
        ) : (
          <div className={styles.grade}>
            {visiveis.map((plano) => (
              <PlanoCard key={plano.id} plano={plano} aoAbrir={aoAbrirPlano} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TelaPlanos;