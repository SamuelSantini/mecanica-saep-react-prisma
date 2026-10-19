import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chamarServidor } from "../api.js";

export default function Login() {
  const navegar = useNavigate();
  const [erro, setErro] = useState("");

  async function entrar(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.target);
    const usuario = await chamarServidor("/api/login", "POST", {
      login: dados.get("login"),
      senha: dados.get("senha"),
    });

    if (usuario.nome) {
      sessionStorage.setItem("nome", usuario.nome);
      navegar("/");
      return;
    }

    setErro(usuario.erro || "Login ou senha inválidos");
  }

  return (
    <div className="centro">
      <h2>Oficina Mecânica</h2>
      <form onSubmit={entrar}>
        <input name="login" placeholder="Login" required /><br />
        <input name="senha" type="password" placeholder="Senha" required /><br />
        <button>Entrar</button>
      </form>
      {erro ? <p>{erro}</p> : null}
      <p>Login: admin<br />Senha: 123456</p>
    </div>
  );
}
