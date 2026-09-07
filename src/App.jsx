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
import styles from "./App.module.css";

const PERFIL_VAZIO = {
  fotoUrl: "",
  anosExperiencia: "",
  modalidade: "ONLINE",
  especialidade: "",
  descricao: "",
};

function App() {
  // sessão
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [telaPublica, setTelaPublica] = useState("inicial");
  const [tela, setTela] = useState("dashboard");

  // dados
  const [perfil, setPerfil] = useState(PERFIL_VAZIO);
  const [planos, setPlanos] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [planoAberto, setPlanoAberto] = useState(null);
  const [personais, setPersonais] = useState([]);
  const [contratacoes, setContratacoes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  // requisições
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function cadastrarUsuario(dados) {
    // >>> API: POST /usuarios
    if (usuarios.some((item) => item.email === dados.email)) {
      throw new Error("Já existe uma conta com esse e-mail.");
    }

    const criado = { ...dados, id: Date.now() };
    setUsuarios((anteriores) => [...anteriores, criado]);
    setUsuario(criado);
    setTela(criado.tipo === "PERSONAL" ? "perfil" : "personais");
  }

  async function entrar({ email, senha }) {
    // >>> API: POST /login
    const encontrado = usuarios.find(
      (item) => item.email === email && item.senha === senha
    );

    if (!encontrado) {
      throw new Error("E-mail ou senha incorretos.");
    }

    setUsuario(encontrado);
    setTela(encontrado.tipo === "PERSONAL" ? "dashboard" : "personais");
  }

  function sair() {
    setUsuario(null);
    setTelaPublica("inicial");
  }

  async function salvarPerfil(dados) {
    // >>> API: PUT /personais/{id}
    setPerfil(dados);
  }

  async function cadastrarPlano(dados) {
    // >>> API: POST /planos
    const criado = { ...dados, id: Date.now(), personalId: usuario.id };
    setPlanos((anteriores) => [...anteriores, criado]);
  }

  function abrirPlano(plano) {
    setPlanoAberto(plano);
    setTela("treinos");
    // >>> API: GET /planos/{id}/treinos
    setTreinos([]);
  }

  async function cadastrarTreino(dados) {
    // >>> API: POST /planos/{id}/treinos
    const criado = { ...dados, id: Date.now(), planoId: planoAberto.id };
    setTreinos((anteriores) => [...anteriores, criado]);
  }

  async function contratarPersonal(personal) {
    // >>> API: POST /contratacoes
    const nova = {
      id: Date.now(),
      alunoId: usuario.id,
      alunoNome: usuario.nome,
      personalId: personal.id,
      dataInicio: new Date().toLocaleDateString("pt-BR"),
    };
    setContratacoes((anteriores) => [...anteriores, nova]);
  }

  async function avaliarPlano(planoId, estrelas) {
    // >>> API: POST /avaliacoes
    setAvaliacoes((anteriores) => [
      ...anteriores.filter(
        (item) => !(item.planoId === planoId && item.alunoId === usuario.id)
      ),
      { id: Date.now(), planoId, alunoId: usuario.id, estrelas },
    ]);
  }

  // tela inicial: fica FORA do wrapper para ocupar a tela inteira
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