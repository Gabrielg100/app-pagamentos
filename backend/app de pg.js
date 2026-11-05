const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        mensagem: "API do aplicativo de pagamentos funcionando!"
    });
});

const path = require("path");
const caminhoArquivo = path.join(__dirname, "..", "database", "pagamentos.json");
const pagamentos = JSON.parse(fs.readFileSync(caminhoArquivo, "utf8"));

// Rota de pagamentos
app.get("/pagamentos", (req, res) => {
    res.json({
        mensagem: "Rota de pagamentos funcionando!",
        pagamentos: pagamentos
    });
});
// Criar pagamento
app.post("/pagamentos", (req, res) => {
    const { nome, valor, metodo, status, vencimento } = req.body;

    const pagamento = {
        id: Date.now(),
        nome,
        valor,
        metodo,
        vencimento,
status: "Pendente"
    };

    pagamentos.push(pagamento);

    fs.writeFileSync(caminhoArquivo, JSON.stringify(pagamentos, null, 2));

    res.status(201).json({
        mensagem: "Pagamento criado com sucesso!",
        pagamento
    });
});
// Atualizar pagamento
app.put("/pagamentos/:id", (req, res) => {
    const id = Number(req.params.id);
    const { nome, valor, metodo, status } = req.body;

    const indice = pagamentos.findIndex(pagamento => pagamento.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Pagamento não encontrado"
        });
    }

    pagamentos[indice] = {
        id: pagamentos[indice].id,
        nome,
        valor,
        metodo,
status: status || pagamentos[indice].status || "Pendente"
    };

    fs.writeFileSync(caminhoArquivo, JSON.stringify(pagamentos, null, 2));
    res.json({
        mensagem: "Pagamento atualizado com sucesso!",
        pagamento: pagamentos[indice]
    });
});
// Deletar pagamento
app.delete("/pagamentos/:id", (req, res) => {
    const id = Number(req.params.id);

    const indice = pagamentos.findIndex(pagamento => pagamento.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Pagamento não encontrado"
        });
    }

    const pagamentoRemovido = pagamentos.splice(indice, 1);
    fs.writeFileSync(caminhoArquivo, JSON.stringify(pagamentos, null, 2));

    res.json({
        mensagem: "Pagamento removido com sucesso!",
        pagamento: pagamentoRemovido[0]
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
