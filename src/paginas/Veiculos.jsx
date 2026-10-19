import { useEffect, useState } from "react";
import { chamarServidor } from "../api.js";

const formularioVazio = { id: "", placa: "", modelo: "", ano: "", id_cliente: "" };

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(formularioVazio);

  async function carregarVeiculos() {
    const [listaDeClientes, listaDeVeiculos] = await Promise.all([
      chamarServidor("/api/clientes"),
      chamarServidor("/api/veiculos"),
    ]);
    setClientes(listaDeClientes);
    setVeiculos(listaDeVeiculos);
  }

  useEffect(() => {
    carregarVeiculos();
  }, []);

  function alterarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
  }

  function preencherFormulario(veiculo) {
    setFormulario({
      id: String(veiculo.id),
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      ano: String(veiculo.ano),
      id_cliente: String(veiculo.id_cliente),
    });
  }

  async function salvar(evento) {
    evento.preventDefault();
    const dados = {
      placa: formulario.placa,
      modelo: formulario.modelo,
      ano: formulario.ano,
      id_cliente: formulario.id_cliente,
    };

    if (formulario.id) await chamarServidor("/api/veiculos/" + formulario.id, "PUT", dados);
    else await chamarServidor("/api/veiculos", "POST", dados);

    setFormulario(formularioVazio);
    carregarVeiculos();
  }

  async function excluir(id) {
    await chamarServidor("/api/veiculos/" + id, "DELETE");
    carregarVeiculos();
  }

  return (
    <>
      <h2>Veículos</h2>
      <form onSubmit={salvar}>
        <input id="placa" placeholder="Placa" value={formulario.placa} onChange={alterarCampo} required />
        <input id="modelo" placeholder="Modelo" value={formulario.modelo} onChange={alterarCampo} required />
        <input id="ano" type="number" placeholder="Ano" value={formulario.ano} onChange={alterarCampo} required />
        <select id="id_cliente" value={formulario.id_cliente} onChange={alterarCampo} required>
          <option value="">Selecione o cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
          ))}
        </select>
        <button>Salvar</button>
      </form>
      <table>
        <thead>
          <tr><th>Placa</th><th>Modelo</th><th>Ano</th><th>Cliente</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>{veiculo.placa}</td>
              <td>{veiculo.modelo}</td>
              <td>{veiculo.ano}</td>
              <td>{veiculo.cliente}</td>
              <td>
                <button type="button" onClick={() => preencherFormulario(veiculo)}>Editar</button>
                <button type="button" onClick={() => excluir(veiculo.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
