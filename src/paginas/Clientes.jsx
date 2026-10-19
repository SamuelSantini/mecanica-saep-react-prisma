import { useEffect, useState } from "react";
import { chamarServidor } from "../api.js";

const formularioVazio = { id: "", nome: "", cpf: "", telefone: "" };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(formularioVazio);

  async function carregarClientes() {
    setClientes(await chamarServidor("/api/clientes"));
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function alterarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
  }

  function preencherFormulario(cliente) {
    setFormulario({
      id: String(cliente.id),
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
    });
  }

  async function salvar(evento) {
    evento.preventDefault();
    const dados = {
      nome: formulario.nome,
      cpf: formulario.cpf,
      telefone: formulario.telefone,
    };

    if (formulario.id) await chamarServidor("/api/clientes/" + formulario.id, "PUT", dados);
    else await chamarServidor("/api/clientes", "POST", dados);

    setFormulario(formularioVazio);
    carregarClientes();
  }

  async function excluir(id) {
    await chamarServidor("/api/clientes/" + id, "DELETE");
    carregarClientes();
  }

  return (
    <>
      <h2>Clientes</h2>
      <form onSubmit={salvar}>
        <input id="nome" placeholder="Nome" value={formulario.nome} onChange={alterarCampo} required />
        <input id="cpf" placeholder="CPF" value={formulario.cpf} onChange={alterarCampo} required />
        <input id="telefone" placeholder="Telefone" value={formulario.telefone} onChange={alterarCampo} required />
        <button>Salvar</button>
      </form>
      <table>
        <thead>
          <tr><th>Nome</th><th>CPF</th><th>Telefone</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.cpf}</td>
              <td>{cliente.telefone}</td>
              <td>
                <button type="button" onClick={() => preencherFormulario(cliente)}>Editar</button>
                <button type="button" onClick={() => excluir(cliente.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
