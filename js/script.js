//simula um banco de dados em memória
var clientes = []

//guarda o objeto que está sendo alterado
var clienteAlterado = null

function adicionar(){
    //libera para digitar o CPF
    document.getElementById("cpf").disabled = false
    clienteAlterado = null
    mostrarModal()
    limparForm()
}
function alterar(cpf){

    //procurar o cliente que tem o CPF clicado no alterar
    for(let i = 0; i < clientes.length; i++){
        let cliente = clientes[i]
        if (cliente.cpf == cpf){
            //achou o cliente, entao preenche o form
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("telefone").value = cliente.telefone
            document.getElementById("sapato").value = cliente.sapato
            document.getElementById("time").value = cliente.time
            clienteAlterado = cliente
        }
    }
    //bloquear o cpf para nao permitir alterá-lo
    document.getElementById("cpf").disabled = true
    mostrarModal()
}
function excluir(cpf){
    if (confirm("Você deseja realmente excluir?")){
        fetch("http://localhost:3000/excluir/" + cpf, {
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        }).then((response) => {
            //após terminar de excluir, recarrega a lista 
            //de clientes
            recarregarClientes()
            alert("Cliente excluído com sucesso")
        }).catch((error) => {
            console.log(error)
            alert("Não foi possível excluir o cliente")
        })       
    }
}
function mostrarModal(){
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "flex"
}
function ocultarModal(){
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "none"
}
function cancelar(){
    ocultarModal()
    limparForm()
}
function salvar(){
    let nome = document.getElementById("nome").value
    let cpf = document.getElementById("cpf").value
    let telefone = document.getElementById("telefone").value
    let sapato = document.getElementById("sapato").value
    let time = document.getElementById("time").value

    //se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null){
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "sapato": sapato,
            "time": time,
        }

        //salva o cliente no back-end
        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()
            recarregarClientes()
            alert("Cliente cadastrado com sucesso")
        }).catch(() => {
            alert("Ops... algo deu errado")
        })

    }else{
        clienteAlterado.nome = nome
        clienteAlterado.cpf = cpf
        clienteAlterado.telefone = telefone
        clienteAlterado.sapato = sapato
        clienteAlterado.time = time
        fetch("http://localhost:3000/alterar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(clienteAlterado)
        }).then((response) => {
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()
            recarregarClientes()
            alert("Cliente alterado com sucesso")
        }).catch((error) => {
            alert("Não foi possível alterar o cliente")
        })
    }
}

function exibirDados(){

    let tbody = document.querySelector("#table-customers tbody")

    //antes de listar os clientes, limpa todas as linhas
    tbody.innerHTML = ""

    for(let i = 0; i < clientes.length; i++){
        let linha = `
        <tr>
            <td>${clientes[i].nome}</td>
            <td>${clientes[i].cpf}</td>
            <td>${clientes[i].telefone}</td>
            <td>${clientes[i].sapato}</td>
            <td>${clientes[i].time}</td>
            <td>
                <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`
        
        let tr = document.createElement("tr")
        tr.innerHTML = linha

        tbody.appendChild(tr)
    }

}
function limparForm(){
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("telefone").value = ""
    document.getElementById("sapato").value = ""
    document.getElementById("time").value = ""
}

function recarregarClientes(){
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then((response) => response.json()) //converte a resposta para JSON
    .then((response) => {
        console.log(response)
        clientes = response //recebe os clientes do back-end
        exibirDados()
    }).catch((error) => {
        alert("Erro ao listar os clientes")
    })
}
function buscarClientes() {
    var searchTerm = document.getElementById("searchInput").value;

    // Enviar a requisição para o back-end
    fetch('http://localhost:3000/buscar-clientes?nome=' + searchTerm)
        .then(response => response.json())
        .then(data => {
            // Limpar a tabela de resultados
            var table = document.getElementById("table-customers");
            table.innerHTML = "";

            // Adicionar cabeçalho da tabela
            var header = table.createTHead();
            var row = header.insertRow(0);
            row.innerHTML = "<th>Nome</th><th>CPF</th><th>Telefone</th><th>Sapato</th><th>Time</th>";

            // Adicionar os clientes encontrados à tabela
            data.forEach(cliente => {
                var row = table.insertRow(-1);
                row.innerHTML = "<td>" + cliente.nome + "</td><td>" + cliente.cpf + "</td><td>" + cliente.telefone + "</td><td>" + cliente.sapato + "</td><td>" + cliente.time + "</td>";
            });
        })
        .catch(error => console.error('Erro ao buscar clientes:', error));
}