import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import Login from "./paginas/Login.jsx";
import Inicio from "./paginas/Inicio.jsx";
import Clientes from "./paginas/Clientes.jsx";
import Veiculos from "./paginas/Veiculos.jsx";
import Agendamentos from "./paginas/Agendamentos.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
      </Route>
    </Routes>
  );
}
