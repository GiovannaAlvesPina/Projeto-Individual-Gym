import { useState } from "react";
import Cartao from "../../Componentes/Cartao/Cartao";
import Campo from "../../Componentes/Campo/Campo";
import Botao from "../../Componentes/Botao/Botao";
import Aviso from "../../Componentes/Aviso/Aviso";
import { MODALIDADES } from "../../dados/opcoes";
import styles from "./TelaPerfil.module.css";

function TelaPerfil({ perfil, aoSalvar }) {
  const [form, setForm] = useState(perfil);
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

    if (!form.descricao.trim()) {
      setErro("Escreva uma apresentação para os alunos.");
      return;
    }

    setEnviando(true);

    try {
      await aoSalvar(form);
      setSucesso("Perfil atualizado.");
    } catch (problema) {
      setErro(problema.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.layout}>
      <Cartao titulo="Meu perfil">
        <form onSubmit={aoEnviar}>
          <Campo
            rotulo="URL da foto"
            name="fotoUrl"
            value={form.fotoUrl}
            onChange={aoDigitar}
            placeholder="https://..."
          />
          <Campo
            rotulo="Anos de experiência"
            name="anosExperiencia"
            tipo="number"
            min="0"
            value={form.anosExperiencia}
            onChange={aoDigitar}
          />
          <Campo
            rotulo="Modalidade"
            name="modalidade"
            value={form.modalidade}
            onChange={aoDigitar}
            opcoes={MODALIDADES}
          />
          <Campo
            rotulo="Especialidade"
            name="especialidade"
            value={form.especialidade}
            onChange={aoDigitar}
          />
          <Campo
            rotulo="Apresentação"
            name="descricao"
            tipo="textarea"
            value={form.descricao}
            onChange={aoDigitar}
          />

          <Botao type="submit" carregando={enviando}>
            Salvar perfil
          </Botao>
        </form>

        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        {sucesso && <Aviso tipo="sucesso">{sucesso}</Aviso>}
      </Cartao>

      <Cartao titulo="Como o aluno vê">
        <div className={styles.previa}>
          <img
            className={styles.foto}
            src={form.fotoUrl}
            alt="Prévia da foto de perfil"
          />
          <p className={styles.detalhe}>
            {form.anosExperiencia || 0} anos de experiência · {form.modalidade}
          </p>
          <p className={styles.descricao}>
            {form.descricao || "Sua apresentação aparece aqui."}
          </p>
        </div>
      </Cartao>
    </div>
  );
}

export default TelaPerfil;