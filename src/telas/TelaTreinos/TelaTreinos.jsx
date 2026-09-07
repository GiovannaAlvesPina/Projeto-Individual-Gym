import { useState } from "react";
import Cartao from "../../Componentes/Cartao/Cartao";
import Campo from "../../Componentes/Campo/Campo";
import Botao from "../../Componentes/Botao/Botao";
import Aviso from "../../Componentes/Aviso/Aviso";
import Carregando from "../../Componentes/Carregando/Carregando";
import { DIAS } from "../../dados/opcoes";
import styles from "./TelaTreinos.module.css";

const VAZIO = { nome: "", diaSemana: "SEGUNDA", exercicios: "", observacoes: "" };

function TelaTreinos({ plano, treinos, carregando, aoCadastrar, aoVoltar }) {
  const [form, setForm] = useState(VAZIO);
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

    if (!form.nome.trim() || !form.exercicios.trim()) {
      setErro("Informe o nome do treino e ao menos um exercício.");
      return;
    }

    setEnviando(true);

    try {
      await aoCadastrar(form);
      setForm(VAZIO);
      setSucesso("Treino adicionado.");
    } catch (problema) {
      setErro(problema.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.layout}>
      <button className={styles.voltar} onClick={aoVoltar}>
        ← Voltar para os planos
      </button>

      <h1 className={styles.titulo}>{plano.titulo}</h1>
      <p className={styles.subtitulo}>
        {plano.categoria} · {plano.nivel} · {plano.duracaoSemanas} semanas
      </p>

      <div className={styles.colunas}>
        <Cartao titulo="Novo treino">
          <form onSubmit={aoEnviar}>
            <Campo rotulo="Nome do treino" name="nome" value={form.nome} onChange={aoDigitar} />
            <Campo
              rotulo="Dia da semana"
              name="diaSemana"
              value={form.diaSemana}
              onChange={aoDigitar}
              opcoes={DIAS}
            />
            <Campo
              rotulo="Exercícios"
              name="exercicios"
              tipo="textarea"
              value={form.exercicios}
              onChange={aoDigitar}
              placeholder="Supino reto 4x10, remada curvada 4x12..."
            />
            <Campo
              rotulo="Observações"
              name="observacoes"
              value={form.observacoes}
              onChange={aoDigitar}
            />

            <Botao type="submit" carregando={enviando}>
              Adicionar treino
            </Botao>
          </form>

          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          {sucesso && <Aviso tipo="sucesso">{sucesso}</Aviso>}
        </Cartao>

        <section>
          {carregando ? (
            <Carregando texto="Carregando treinos..." />
          ) : treinos.length === 0 ? (
            <p className={styles.vazio}>Este plano ainda não tem treinos.</p>
          ) : (
            <ul className={styles.lista}>
              {treinos.map((treino) => (
                <li key={treino.id} className={styles.treino}>
                  <div className={styles.cabecalhoTreino}>
                    <h3>{treino.nome}</h3>
                    <span className={styles.dia}>{treino.diaSemana}</span>
                  </div>
                  <p className={styles.exercicios}>{treino.exercicios}</p>
                  {treino.observacoes && (
                    <p className={styles.observacoes}>{treino.observacoes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default TelaTreinos;