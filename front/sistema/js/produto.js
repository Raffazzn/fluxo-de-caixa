let editandoProduto = null;

// Refatorar função para enviar os dados para o back-end
document.getElementById("btn-salvar-produto").addEventListener("click", async function(){
    const codigo = document.getElementById("cdProduto").value;
    const descricao = document.getElementById("descricaoProduto").value;
    const classificacao = document.getElementById("produtoClassificacao").value;
    const valor = parseFloat(document.getElementById("valorProduto").value);

    if (codigo === "" || descricao === "" || valor === "" || classificacao === "" ){
        alert("Preencha todos os campos");
        return;
    } else {
        if (editandoProduto !== null){
            const response = await fetch("http://localhost:8000/produto", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({codigo, descricao, valor, classificacao}),
            });
            
            if (response.status == 200){
                editandoProduto.children[0].textContent = codigo;
                editandoProduto.children[1].textContent = descricao;
                editandoProduto.children[2].textContent = valor;
                editandoProduto.children[3].textContent = classificacao;
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }            
        } else {
            const response = await fetch("http://localhost:8000/produto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({codigo, descricao, valor, classificacao}),
            });
            
            if (response.status == 200){
                adicionarLinhaTabelaProduto(codigo, descricao, valor, classificacao);
            } else {
                const errorMessage = await response.text();
                alert("Erro: "+errorMessage);
            }
        }
        
        limparFormularioProduto();
    }
})

function adicionarLinhaTabelaProduto(codigo, descricao, valor, classificacao){
    const corpoTabela = document.getElementById("tabela-produto");
    const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = `
        <td>${codigo}</td>
        <td>${descricao}</td>
        <td>${valor}</td>
        <td>${classificacao}</td>
        <td>
            <button type="button" class="btn-acao btn-editar">Editar</button>
            <button type="button" class="btn-acao btn-excluir">Excluir</button>
        </td>
    `
    novaLinha.querySelector(".btn-editar").
        addEventListener("click", function(){
        editarRegistroProduto(novaLinha);
    });
    
    novaLinha.querySelector(".btn-excluir").
        addEventListener("click", function(){
        excluirRegistroProduto(novaLinha);
    });
    
    corpoTabela.appendChild(novaLinha);
}

function limparFormularioProduto(){
    document.getElementById("cdProduto").value = "";
    document.getElementById("descricaoProduto").value = "";
    document.getElementById("valorProduto").value = "";
    document.getElementById("produtoClassificacao").value = "";
}

// Refatorando - Exclui no back-end
async function excluirRegistroProduto(linha){
    if (confirm("Tem certeza que deseja excluir esta linha?")){
        const response = await fetch("http://localhost:8000/produto", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({codigo: linha.children[0].textContent}),
        });
        if (response.status === 200){
            linha.remove();
        } else {
            const errorMessage = await response.text();
            alert("Erro: "+errorMessage);
        }
    }    
}

function editarRegistroProduto(linha){
    document.getElementById("cdProduto").value = linha.children[0].textContent;
    document.getElementById("descricaoProduto").value = linha.children[1].textContent;
    document.getElementById("valorProduto").value = linha.children[2].textContent;
    document.getElementById("produtoClassificacao").value = linha.children[3].textContent;
    
    editandoProduto = linha;
}


// Refatoração - Acessar o Back End
async function getProdutos(){
    const response = await fetch("http://localhost:8000/produto", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (response.status == 200){
        const corpoTabela = document.getElementById("tabela-produto");
        corpoTabela.innerHTML = "";

        const data = await response.json();
        for (produto of data){
            adicionarLinhaTabelaProduto(produto.codigo, produto.descricao, produto.valor, produto.classificacao);    
        }        
    } else {
        errorMessage = await response.text();
        console.log("Erro: ", errorMessage);
    }


    const respProdutoClasse = await fetch("http://localhost:8000/produtoClasse", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },        
    });

    if (respProdutoClasse.status == 200){
        const data = await respProdutoClasse.json();

        // Carrega as Classificações
        const produtoClasseSelect = document.getElementById('produtoClassificacao');
        produtoClasseSelect.innerHTML = "";

        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Selecionar Classificação";
        option.selected = true;
        option.disabled = true;
        produtoClasseSelect.appendChild(option);
    
        data.forEach(produtoClasse => {
            const option = document.createElement('option');
            option.value = produtoClasse.descricao;
            option.textContent = `${produtoClasse.descricao}`;
            produtoClasseSelect.appendChild(option);
        });
    } else {
        errorMessage = await respProdutoClasse.text();
        console.log("Erro: ", errorMessage);
    }

}
