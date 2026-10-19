import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  function sair() {
    sessionStorage.removeItem("nome");
  }

  return (
    <>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/veiculos">Veículos</Link>
        <Link to="/agendamentos">Agendamentos</Link>
        <span>
          <Link to="/login" onClick={sair}>Sair</Link>
        </span>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
