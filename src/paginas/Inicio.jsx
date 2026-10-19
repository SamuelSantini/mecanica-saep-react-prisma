export default function Inicio() {
  const nome = sessionStorage.getItem("nome");

  return (
    <>
      <h2>{nome ? `Bem-vindo, ${nome}!` : "Bem-vindo!"}</h2>
      <p>Use o menu para cadastrar clientes, veículos e agendamentos.</p>
      <p>Um cliente possui veículos. Um veículo tem agendamentos.</p>
    </>
  );
}
