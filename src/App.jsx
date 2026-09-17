import { useState } from "react";
import Cabecalho from "./Componentes/Cabecalho/Cabecalho";
import TelaInicial from "./telas/TelaInicial/TelaInicial";
import TelaLogin from "./telas/TelaLogin/TelaLogin";
import TelaCadastro from "./telas/TelaCadastro/TelaCadastro";
import TelaPerfil from "./telas/TelaPerfil/TelaPerfil";
import TelaPlanos from "./telas/TelaPlanos/TelaPlanos";
import TelaTreinos from "./telas/TelaTreinos/TelaTreinos";
import TelaDashboard from "./telas/TelaDashboard/TelaDashboard";
import TelaPersonais from "./telas/TelaPersonais/TelaPersonais";
import TelaMeusTreinos from "./telas/TelaMeusTreinos/TelaMeusTreinos";
import {
  cadastrarUsuarioApi,
  loginApi,
  listarPersonaisApi,
  salvarPerfilApi,
  listarPlanosApi,
  cadastrarPlanoApi,
  listarTreinosApi,
  cadastrarTreinoApi,
  listarContratacoesPersonalApi,
  listarContratacoesAlunoApi,
  contratarApi,
  listarAvaliacoesPersonalApi,
  avaliarApi,
} from "./servicos/api";
import styles from "./App.module.css";

const PERFIL_VAZIO = {
  fotoUrl: "",
  anosExperiencia: "",
  modalidade: "ONLINE",
  especialidade: "",
  descricao: "",
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [telaPublica, setTelaPublica] = useState("inicial");
  const [tela, setTela] = useState("dashboard");

  const [perfil, setPerfil] = useState(PERFIL_VAZIO);
  const [planos, setPlanos] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [planoAberto, setPlanoAberto] = useState(null);
  const [personais, setPersonais] = useState([]);
  const [contratacoes, setContratacoes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarDados(logado) {
    setCarregando(true);
    setErro("");

    try {
      if (logado.tipo === "PERSONAL") {
        setPerfil({
          fotoUrl: logado.fotoUrl || "",
          anosExperiencia: logado.anosExperiencia || "",
          modalidade: logado.modalidade || "ONLINE",
          especialidade: logado.especialidade || "",
          descricao: logado.descricao || "",
        });

        setPlanos(await listarPlanosApi(logado.id));
        setContratacoes(await listarContratacoesPersonalApi(logado.id));
        setAvaliacoes(await listarAvaliacoesPersonalApi(logado.id));
      } else {
        setPersonais(await listarPersonaisApi());

        const minhas = await listarContratacoesAlunoApi(logado.id);
        setContratacoes(minhas);

        if (minhas.length > 0) {
          setPlanos(await listarPlanosApi(minhas[0].personalId));
        }
      }
    } catch (problema) {
      setErro(problema.message);
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarUsuario(dados) {
    const criado = await cadastrarUsuarioApi(dados);
    setUsuario(criado);
    setTela(criado.tipo === "PERSONAL" ? "perfil" : "personais");
    await carregarDados(criado);
  }

  async function entrar(credenciais) {
    const encontrado = await loginApi(credenciais);
    setUsuario(encontrado);
    setTela(encontrado.tipo === "PERSONAL" ? "dashboard" : "personais");
    await carregarDados(encontrado);
  }

  function sair() {
    setUsuario(null);
    setTelaPublica("inicial");
    setPerfil(PERFIL_VAZIO);
    setPlanos([]);
    setTreinos([]);
    setPersonais([]);
    setContratacoes([]);
    setAvaliacoes([]);
    setErro("");
  }

  async function salvarPerfil(dados) {
    const salvo = await salvarPerfilApi(usuario.id, dados);
    setPerfil(dados);
    setUsuario(salvo);
  }

  async function cadastrarPlano(dados) {
    const criado = await cadastrarPlanoApi({ ...dados, personalId: usuario.id });
    setPlanos((anteriores) => [...anteriores, criado]);
  }

  async function abrirPlano(plano) {
    setPlanoAberto(plano);
    setTela("treinos");
    setCarregando(true);
    setErro("");

    try {
      setTreinos(await listarTreinosApi(plano.id));
    } catch (problema) {
      setErro(problema.message);
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarTreino(dados) {
    const criado = await cadastrarTreinoApi(planoAberto.id, dados);
    setTreinos((anteriores) => [...anteriores, criado]);
  }

  async function contratarPersonal(personal) {
    setErro("");

    try {
      const nova = await contratarApi({
        alunoId: usuario.id,
        personalId: personal.id,
        dataInicio: new Date().toISOString().slice(0, 10),
      });

      setContratacoes((anteriores) => [...anteriores, nova]);
      setPlanos(await listarPlanosApi(personal.id));
    } catch (problema) {
      setErro(problema.message);
    }
  }

  async function avaliarPlano(planoId, estrelas) {
    setErro("");

    try {
      const salva = await avaliarApi({
        alunoId: usuario.id,
        planoId: planoId,
        estrelas: estrelas,
      });

      setAvaliacoes((anteriores) => [
        ...anteriores.filter(
          (item) => !(item.planoId === planoId && item.alunoId === usuario.id)
        ),
        salva,
      ]);
    } catch (problema) {
      setErro(problema.message);
    }
  }

  if (!usuario && telaPublica === "inicial") {
    return (
      <TelaInicial
        aoEntrar={() => setTelaPublica("login")}
        aoCriarConta={() => setTelaPublica("cadastro")}
      />
    );
  }

  if (!usuario) {
    return (
      <div className={styles.pagina}>
        {telaPublica === "login" && (
          <TelaLogin
            aoEntrar={entrar}
            aoIrParaCadastro={() => setTelaPublica("cadastro")}
          />
        )}

        {telaPublica === "cadastro" && (
          <TelaCadastro
            aoCadastrar={cadastrarUsuario}
            aoIrParaLogin={() => setTelaPublica("login")}
          />
        )}
      </div>
    );
  }

  const contratacaoDoAluno = contratacoes.find((item) => item.alunoId === usuario.id);

  const personalContratado = personais.find(
    (item) => item.id === contratacaoDoAluno?.personalId
  );

  const minhasNotas = {};
  avaliacoes
    .filter((item) => item.alunoId === usuario.id)
    .forEach((item) => {
      minhasNotas[item.planoId] = item.estrelas;
    });

  return (
    <div className={styles.pagina}>
      <Cabecalho
        usuario={usuario}
        telaAtual={tela}
        aoNavegar={setTela}
        aoSair={sair}
      />

      <main className={styles.conteudo}>
        {tela === "dashboard" && (
          <TelaDashboard
            planos={planos}
            alunos={contratacoes}
            avaliacoes={avaliacoes}
            carregando={carregando}
            erro={erro}
          />
        )}

        {tela === "perfil" && <TelaPerfil perfil={perfil} aoSalvar={salvarPerfil} />}

        {tela === "planos" && (
          <TelaPlanos
            planos={planos}
            carregando={carregando}
            erroLista={erro}
            aoCadastrar={cadastrarPlano}
            aoAbrirPlano={abrirPlano}
          />
        )}

        {tela === "treinos" && planoAberto && (
          <TelaTreinos
            plano={planoAberto}
            treinos={treinos}
            carregando={carregando}
            aoCadastrar={cadastrarTreino}
            aoVoltar={() => setTela("planos")}
          />
        )}

        {tela === "personais" && (
          <TelaPersonais
            personais={personais}
            contratadoId={contratacaoDoAluno?.personalId}
            carregando={carregando}
            erro={erro}
            aoContratar={contratarPersonal}
          />
        )}

        {tela === "meus-treinos" && (
          <TelaMeusTreinos
            personal={personalContratado}
            planos={planos}
            minhasNotas={minhasNotas}
            carregando={carregando}
            erro={erro}
            aoAvaliar={avaliarPlano}
          />
        )}
      </main>
    </div>
  );
}

export default App;