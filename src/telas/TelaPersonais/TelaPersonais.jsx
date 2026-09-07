import { useState } from "react";
import PersonalCard from "../../Componentes/PersonalCard/PersonalCard";
import Carregando from "../../Componentes/Carregando/Carregando";
import Aviso from "../../Componentes/Aviso/Aviso";
import styles from "./TelaPersonais.module.css";

function TelaPersonais({ personais, contratadoId, carregando, erro, aoContratar }) {
  const [busca, setBusca] = useState("");

  if (carregando) return <Carregando texto="Buscando personais..." />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;

  const visiveis = personais.filter((personal) =>
    personal.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <input
        className={styles.busca}
        type="search"
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
        placeholder="Buscar por nome"
      />

      {visiveis.length === 0 ? (
        <p className={styles.vazio}>Nenhum personal encontrado.</p>
      ) : (
        <div className={styles.lista}>
          {visiveis.map((personal) => (
            <PersonalCard
              key={personal.id}
              personal={personal}
              contratado={personal.id === contratadoId}
              aoContratar={aoContratar}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default TelaPersonais;