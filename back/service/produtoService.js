const fs = require("fs");
const path = require("path");

let produtos = [];

const filePath = path.resolve("db/", "produtos.json");

// Função que salva a lista de produtos na pasta db
const saveProdutosToFile = () => {
    fs.writeFile(filePath, JSON.stringify(produtos, null, 2), (err) => {
        if (err){
            console.error("Erro ao salvar produtos no arquivo:", err);
        } else {
            console.log("produtos Salvos com sucesso")
        }
    })
}
// Função que carrega os produtos salvos na pasta
const loadProdutosFromFile = () => {
    if (fs.existsSync(filePath)){
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err){
                console.error("Erro ao ler o arquivo de produtos", err);
            } else if (data.trim() === ""){
                produtos = [];
                console.log("Arquivo de produtos está vazio");
            } else {
                try {
                    produtos = JSON.parse(data);
                    console.log("produtos carregados com sucesso")
                } catch (parseError) {
                    console.error("erro ao interpretar o JSON", parseError);
                }
            }
        })   
    }
}

const addProduto = (value) => {
    const produto = {
        codigo : value.codigo,
        descricao : value.descricao,
        valor : value.valor,
        classificacao : value.classificacao
    }

    produtos.push(produto);
    saveProdutosToFile();
    console.log("produto Cadastrado: ", produto);
    return produto;
}

const findProdutoByCodigo = (codigo) => {
    return produtos.find(produto => produto.codigo === codigo) || null;
}

const updateProduto = (value) => {
    const produto = findProdutoByCodigo(value.codigo);
    if (produto){
        produto.codigo = value.codigo;
        produto.descricao = value.descricao;
        produto.valor = value.valor;
        produto.classificacao = value.classificacao;
    
        saveProdutosToFile();
        console.log("produto atualizado: ", produto);
        
        return produto;
    } else {
        return null;
    }
}

const deleteProduto = (codigo) => {
    const index = produtos.findIndex(produto => produto.codigo === codigo);

    if (index !== -1){
        produtos.splice(index, 1); // remove o produto da lista
        saveProdutosToFile()
        console.log("produto Deletado: ", codigo);
        return true;
    } else {
        return false;
    }
}

// Função que devolve a lista de produtos
const listProdutos = () => {
    return produtos;
}

// Carrega os produtos salvos no arquivo ao iniciar
loadProdutosFromFile();

// Exportamos as funções para poder utilizar nos outros módulos
exports.findProdutoByCodigo = findProdutoByCodigo;
exports.addProduto = addProduto;
exports.updateProduto = updateProduto;
exports.deleteProduto = deleteProduto;
exports.listProdutos = listProdutos;