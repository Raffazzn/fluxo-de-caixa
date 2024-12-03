let editandoCategoriaConta = null;

// Refatorar função para enviar os dados para o back-end
document.getElementById("btn-salvar-Categoria").addEventListener("click", async function(){
    const descricao = document.getElementById("descricaoCategoria").value;
    const descricaoAnterior = document.getElementById("descricaoAnteriorCategoria").value;
    const categoria = document.getElementById("categoria").value;

    if (descricao === ""){
        alert("Preencha a Descrição da Categoria");
        return;
    } else {
        if (editandoCategoriaConta !== null){
            const response = await fetch("http://localhost:8000/categoria", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({descricao, descricaoAnterior,categoria}),
            });
            
            if (response.status == 200){
                editandoCategoriaConta.children[0].textContent = descricao;
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }            
        } else {
            const response = await fetch("http://localhost:8000/categoria", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({descricao,categoria}),
            });
            
            if (response.status == 200){
                adicionarLinhaTabelaCategoriaConta(descricao,categoria);
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }
        }
        
        limparFormularioCategoriaConta();
    }
})

function adicionarLinhaTabelaCategoriaConta(descricao,categoria){
    const corpoTabela = document.getElementById("tabela-categoriaConta");
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
        <td>${descricao}</td>
        <td class="colunaCentro">${categoria == "Receita" ? '<i class="fa-solid fa-check"></i>' : ""} </td>
        <td class="colunaCentro">${categoria == "Despesa" ? '<i class="fa-solid fa-check"></i>' : ""}</td>
        <td>
            <button class="btn-acao btn-editar">Editar</button>
            <button class="btn-acao btn-excluir">Excluir</button>
        </td>
    `

    novaLinha.querySelector(".btn-editar").
        addEventListener("click", function(){
        editarRegistroCategoriaConta(novaLinha);
    });
    
    novaLinha.querySelector(".btn-excluir").
        addEventListener("click", function(){
        excluirRegistroCategoriaConta(novaLinha);
    });
    
    corpoTabela.appendChild(novaLinha);
}

function limparFormularioCategoriaConta(){
    document.getElementById("descricaoCategoria").value = "";
    document.getElementById("descricaoAnteriorCategoria").value = "";
    document.getElementById("categoria").value = "";
}

// Refatorando - Exclui no back-end
async function excluirRegistroCategoriaConta(linha){
    if (confirm("Tem certeza que deseja excluir esta linha?")){
        const response = await fetch("http://localhost:8000/categoria", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({descricao: linha.children[0].textContent}),
        });
        if (response.status === 200){
            linha.remove();
        } else {
            const errorMessage = await response.text();
            alert("Erro: "+errorMessage);
        }
    }    
}

function editarRegistroCategoriaConta(linha){
    document.getElementById("descricaoCategoria").value = linha.children[0].textContent;
    document.getElementById("descricaoAnteriorCategoria").value = linha.children[0].textContent;
 
    const chekIcon = linha.children[1].querySelector("i.fa-solid");
    
    if (chekIcon)
        document.getElementById("categoria").value = "Receita";
    else
        document.getElementById("categoria").value = "Despesa";

    
    editandoCategoriaConta = linha;
}


// Refatoração - Acessar o Back End
async function getCategoriasConta(){
    const response = await fetch("http://localhost:8000/categoria", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status == 200){
        const corpoTabela = document.getElementById("tabela-categoriaConta");
        corpoTabela.innerHTML = "";

        const data = await response.json();
        for (categoria of data){
            adicionarLinhaTabelaCategoriaConta(categoria.descricao,categoria.categoria);    
        }        
    } else {
        errorMessage = response.text();
        console.log("Erro: ", errorMessage);
    }
}