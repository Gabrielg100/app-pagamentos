const express = require("express");
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

// Rota de pagamentos
app.get("/pagamentos", (req, res) => {
    res.json({
        mensagem: "Rota de pagamentos funcionando!",
        pagamentos: []
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
