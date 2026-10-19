import { useEffect, useState } from "react";
import { chamarServidor } from "../api.js";

const formularioVazio = { id: "", data_agendamento: "", servico: "", id_veiculo: "" };

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [formulario, setFormulario] = useState(formularioVazio);

  async function carregarAgendamentos() {
    const [listaDeVeiculos, listaDeAgendamentos] = await Promise.all([
      chamarServidor("/api/veiculos"),
      chamarServidor("/api/agendamentos"),
    ]);
    setVeiculos(listaDeVeiculos);
    setAgendamentos(listaDeAgendamentos);
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  function alterarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
  }

  function preencherFormulario(agendamento) {
    setFormulario({
      id: String(agendamento.id),
      data_agendamento: agendamento.data_agendamento,
      servico: agendamento.servico,
      id_veiculo: String(agendamento.id_veiculo),
    });
  }

  async function salvar(evento) {
    evento.preventDefault();
    const dados = {
      data_agendamento: formulario.data_agendamento,
      servico: formulario.servico,
      id_veiculo: formulario.id_veiculo,
    };

    if (formulario.id) await chamarServidor("/api/agendamentos/" + formulario.id, "PUT", dados);
    else await chamarServidor("/api/agendamentos", "POST", dados);

    setFormulario(formularioVazio);
    carregarAgendamentos();
  }

  async function excluir(id) {
    await chamarServidor("/api/agendamentos/" + id, "DELETE");
    carregarAgendamentos();
  }

  return (
    <>
      <h2>Agendamentos</h2>
      <form onSubmit={salvar}>
        <input id="data_agendamento" type="date" value={formulario.data_agendamento} onChange={alterarCampo} required />
        <input id="servico" placeholder="Serviço" value={formulario.servico} onChange={alterarCampo} required />
        <select id="id_veiculo" value={formulario.id_veiculo} onChange={alterarCampo} required>
          <option value="">Selecione o veículo</option>
          {veiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>{veiculo.placa} - {veiculo.modelo}</option>
          ))}
        </select>
        <button>Salvar</button>
      </form>
      <table>
        <thead>
          <tr><th>Data</th><th>Serviço</th><th>Cliente</th><th>Placa</th><th>Modelo</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {agendamentos.map((agendamento) => (
            <tr key={agendamento.id}>
              <td>{agendamento.data_agendamento}</td>
              <td>{agendamento.servico}</td>
              <td>{agendamento.cliente}</td>
              <td>{agendamento.placa}</td>
              <td>{agendamento.modelo}</td>
              <td>
                <button type="button" onClick={() => preencherFormulario(agendamento)}>Editar</button>
                <button type="button" onClick={() => excluir(agendamento.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
