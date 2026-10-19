import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "./prisma.js";

const app = express();
const producao = process.argv.includes("--producao");
const pastaDoProjeto = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

function dataSomenteDia(data) {
  return data.toISOString().slice(0, 10);
}

app.post("/api/login", async (req, res) => {
  const { login, senha } = req.body;
  const usuario = await prisma.usuario.findFirst({
    where: { login, senha },
  });

  if (!usuario) {
    return res.status(401).json({ erro: "Login ou senha inválidos" });
  }

  res.json({ nome: usuario.nome });
});

app.get("/api/clientes", async (req, res) => {
  const clientes = await prisma.cliente.findMany({ orderBy: { nome: "asc" } });
  res.json(clientes);
});

app.post("/api/clientes", async (req, res) => {
  const { nome, cpf, telefone } = req.body;
  await prisma.cliente.create({ data: { nome, cpf, telefone } });
  res.json({ ok: true });
});

app.put("/api/clientes/:idDoRegistro", async (req, res) => {
  const { nome, cpf, telefone } = req.body;
  await prisma.cliente.update({
    where: { id: Number(req.params.idDoRegistro) },
    data: { nome, cpf, telefone },
  });
  res.json({ ok: true });
});

app.delete("/api/clientes/:idDoRegistro", async (req, res) => {
  await prisma.cliente.delete({ where: { id: Number(req.params.idDoRegistro) } });
  res.json({ ok: true });
});

app.get("/api/veiculos", async (req, res) => {
  const veiculos = await prisma.veiculo.findMany({
    orderBy: { id: "asc" },
    include: { cliente: true },
  });

  res.json(
    veiculos.map((veiculo) => ({
      id: veiculo.id,
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      ano: veiculo.ano,
      id_cliente: veiculo.idCliente,
      cliente: veiculo.cliente.nome,
    })),
  );
});

app.post("/api/veiculos", async (req, res) => {
  const { placa, modelo, ano, id_cliente } = req.body;
  await prisma.veiculo.create({
    data: {
      placa,
      modelo,
      ano: Number(ano),
      idCliente: Number(id_cliente),
    },
  });
  res.json({ ok: true });
});

app.put("/api/veiculos/:idDoRegistro", async (req, res) => {
  const { placa, modelo, ano, id_cliente } = req.body;
  await prisma.veiculo.update({
    where: { id: Number(req.params.idDoRegistro) },
    data: {
      placa,
      modelo,
      ano: Number(ano),
      idCliente: Number(id_cliente),
    },
  });
  res.json({ ok: true });
});

app.delete("/api/veiculos/:idDoRegistro", async (req, res) => {
  await prisma.veiculo.delete({ where: { id: Number(req.params.idDoRegistro) } });
  res.json({ ok: true });
});

app.get("/api/agendamentos", async (req, res) => {
  const agendamentos = await prisma.agendamento.findMany({
    orderBy: { dataAgendamento: "asc" },
    include: { veiculo: { include: { cliente: true } } },
  });

  res.json(
    agendamentos.map((agendamento) => ({
      id: agendamento.id,
      data_agendamento: dataSomenteDia(agendamento.dataAgendamento),
      servico: agendamento.servico,
      id_veiculo: agendamento.idVeiculo,
      cliente: agendamento.veiculo.cliente.nome,
      placa: agendamento.veiculo.placa,
      modelo: agendamento.veiculo.modelo,
    })),
  );
});

app.post("/api/agendamentos", async (req, res) => {
  const { data_agendamento, servico, id_veiculo } = req.body;
  await prisma.agendamento.create({
    data: {
      dataAgendamento: new Date(data_agendamento),
      servico,
      idVeiculo: Number(id_veiculo),
    },
  });
  res.json({ ok: true });
});

app.put("/api/agendamentos/:idDoRegistro", async (req, res) => {
  const { data_agendamento, servico, id_veiculo } = req.body;
  await prisma.agendamento.update({
    where: { id: Number(req.params.idDoRegistro) },
    data: {
      dataAgendamento: new Date(data_agendamento),
      servico,
      idVeiculo: Number(id_veiculo),
    },
  });
  res.json({ ok: true });
});

app.delete("/api/agendamentos/:idDoRegistro", async (req, res) => {
  await prisma.agendamento.delete({ where: { id: Number(req.params.idDoRegistro) } });
  res.json({ ok: true });
});

app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ erro: "Erro no servidor" });
});

if (producao) {
  const pastaDist = path.join(pastaDoProjeto, "dist");
  app.use(express.static(pastaDist));
  app.use((req, res) => {
    res.sendFile(path.join(pastaDist, "index.html"));
  });
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(3000, () => {
  console.log("Abra http://localhost:3000");
  console.log("Login: admin    Senha: 123456");
});
