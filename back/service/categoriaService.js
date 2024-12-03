const fs = require("fs");
const path = require("path");

let CategoriasConta = [];

const filePath = path.resolve("db/", "categoriaConta.json");

// Função que salva a lista de CategoriaConta na pasta db
const saveCategoriaContaToFile = () => {
    fs.writeFile(filePath, JSON.stringify(CategoriasConta, null, 2), (err) => {
        if (err){
            console.error("Erro ao salvar produto Classes no arquivo:", err);
        } else {
            console.log("produto Classes Salvos com sucesso");
        }
    })
} 
// Função que carrega os CategoriaConta salvos na pasta
const loadCategoriaContaFromFile = () => {
    if (fs.existsSync(filePath)){
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err){
                console.error("Erro ao ler o arquivo de CategoriaConta", err);
            } else if (data.trim() === ""){
                console.log("data> ", data);
                CategoriasConta = [];
                console.log("Arquivo de CategoriaConta está vazio");
            } else {
                try {
                    CategoriasConta = JSON.parse(data);
                    console.log("CategoriaConta carregados com sucesso")
                } catch (parseError) {
                    console.error("erro ao interpretar o JSON", parseError);
                }
            }
        })   
    }
}

const addCategoriaConta = (value) => {
    const CategoriaConta = {
        descricao : value.descricao,
        categoria: value.categoria
    }

    CategoriasConta.push(CategoriaConta);
    saveCategoriaContaToFile();
    console.log("CategoriaConta Cadastrado: ", CategoriaConta);
    return CategoriaConta;
}

const findCategoriaContaByDescricao = (descricao) => {
    return CategoriasConta.find(CategoriaConta => CategoriaConta.descricao === descricao) || null;
}

const updateCategoriaConta = (value) => {
    const CategoriaConta = findCategoriaContaByDescricao(value.descricaoAnterior);
    if (CategoriaConta){
        CategoriaConta.descricao = value.descricao;
        CategoriaConta.categoria = value.categoria;
    
        saveCategoriaContaToFile();
        console.log("produto Classe atualizado: ", CategoriaConta);
        
        return CategoriaConta;
    } else {
        return null;
    }
}

const deleteCategoriaConta = (descricao) => {
    const index = CategoriasConta.findIndex(CategoriaConta => CategoriaConta.descricao === descricao);

    if (index !== -1){
        CategoriasConta.splice(index, 1); // remove o produto Classe da lista
        saveCategoriaContaToFile()
        console.log("produto Classe Deletado: ", descricao);
        return true;
    } else {
        return false;
    }
}

// Função que devolve a lista de CategoriaConta
const listCategoriaConta = () => {
    return CategoriasConta;
}

// Carrega os CategoriaConta salvos no arquivo ao iniciar
loadCategoriaContaFromFile();

// Exportamos as funções para poder utilizar nos outros módulos
exports.findCategoriaContaByDescricao = findCategoriaContaByDescricao;
exports.addCategoriaConta = addCategoriaConta;
exports.updateCategoriaConta = updateCategoriaConta;
exports.deleteCategoriaConta = deleteCategoriaConta;
exports.listCategoriaConta = listCategoriaConta;