const API_URL = "http://localhost:8080";

async function requisitar(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (resposta.status === 204) {
    return [];
  }

  if (!resposta.ok) {
    if (resposta.status === 409) throw new Error("Esse registro já existe.");
    if (resposta.status === 404) throw new Error("Registro não encontrado.");
    if (resposta.status === 400) throw new Error("Dados inválidos.");
    throw new Error("Erro ao comunicar com o servidor.");
  }

  return resposta.json();
}

export const cadastrarUsuarioApi = (dados) =>
  requisitar("/usuarios", { method: "POST", body: JSON.stringify(dados) });

export const loginApi = (dados) =>
  requisitar("/usuarios/login", { method: "POST", body: JSON.stringify(dados) });

export const listarPersonaisApi = () => requisitar("/personais");

export const salvarPerfilApi = (id, dados) =>
  requisitar(`/personais/${id}`, { method: "PUT", body: JSON.stringify(dados) });

export const listarPlanosApi = (personalId) =>
  requisitar(`/planos/personal/${personalId}`);

export const cadastrarPlanoApi = (dados) =>
  requisitar("/planos", { method: "POST", body: JSON.stringify(dados) });

export const listarTreinosApi = (planoId) => requisitar(`/planos/${planoId}/treinos`);

export const cadastrarTreinoApi = (planoId, dados) =>
  requisitar(`/planos/${planoId}/treinos`, {
    method: "POST",
    body: JSON.stringify(dados),
  });

export const listarContratacoesPersonalApi = (personalId) =>
  requisitar(`/contratacoes/personal/${personalId}`);

export const listarContratacoesAlunoApi = (alunoId) =>
  requisitar(`/contratacoes/aluno/${alunoId}`);

export const contratarApi = (dados) =>
  requisitar("/contratacoes", { method: "POST", body: JSON.stringify(dados) });

export const listarAvaliacoesPersonalApi = (personalId) =>
  requisitar(`/avaliacoes/personal/${personalId}`);

export const avaliarApi = (dados) =>
  requisitar("/avaliacoes", { method: "POST", body: JSON.stringify(dados) });