import prisma from "../prisma.js";

const joao = { nome: "João Silva", cpf: "111.111.111-11", telefone: "(48) 99999-1111" };
const maria = { nome: "Maria Santos", cpf: "222.222.222-22", telefone: "(48) 99999-2222" };
const pedro = { nome: "Pedro Costa", cpf: "333.333.333-33", telefone: "(48) 99999-3333" };

async function principal() {
  await prisma.agendamento.deleteMany();
  await prisma.veiculo.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();

  await prisma.usuario.create({
    data: { nome: "Administrador", login: "admin", senha: "123456" },
  });

  const clienteJoao = await prisma.cliente.create({ data: joao });
  const clienteMaria = await prisma.cliente.create({ data: maria });
  const clientePedro = await prisma.cliente.create({ data: pedro });

  const gol = await prisma.veiculo.create({
    data: { placa: "ABC-1234", modelo: "Gol", ano: 2015, idCliente: clienteJoao.id },
  });
  const onix = await prisma.veiculo.create({
    data: { placa: "DEF-5678", modelo: "Onix", ano: 2020, idCliente: clienteMaria.id },
  });
  const palio = await prisma.veiculo.create({
    data: { placa: "GHI-9012", modelo: "Palio", ano: 2012, idCliente: clientePedro.id },
  });

  await prisma.agendamento.createMany({
    data: [
      { dataAgendamento: new Date("2026-10-20"), servico: "Troca de óleo", idVeiculo: gol.id },
      { dataAgendamento: new Date("2026-10-18"), servico: "Revisão completa", idVeiculo: onix.id },
      { dataAgendamento: new Date("2026-10-25"), servico: "Troca de freios", idVeiculo: palio.id },
    ],
  });
}

principal()
  .then(() => prisma.$disconnect())
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
