async function listarMedicos() {
    try {
        const respostaServidor = await fetch("http://localhost:3333/lista/medicos", {
            method:"GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const response = await respostaServidor.json();
        criarTabelaMedicos(response);

        if(!respostaServidor.ok) {
            throw new  Error("Erro a receber os dados para o servidor. Contate o administrador do sistema");
        }

    } catch (error) {
        console.log(error);
        alert(`Erro ao se comunicar com o servidor.${error}`)
    } 
}

async function criarTabelaMedicos(medico) {
    const tabela = document.querySelector('tbody');

    // Cria as linhas da tabela com os dados do array
    livros.forEach(medico => {
        const linhas = document.createElement('tr');

        // Cria cada célula com os dados do carro
        const celulaID = document.createElement('td');
        celulaID.textContent = medico.idMedico;
        linhas.appendChild(celulaID);

        const celulaNome = document.createElement('td');
        celulaNome.textContent = medico.nome;
        linhas.appendChild(celulaNome);

        const celulaEspecialidade = document.createElement('td');
        celulaEspecialidade.textContent = medico.especialidade;
        linhas.appendChild(celulaEspecialidade);

        const celulaCRM = document.createElement('td');
        celulaAno.numberContent = medico.crm;
        linhas.appendChild(celulaCRM);

        const celulaEmail = document.createElement('td');
        celulaEmail.textContent = medico.email;
        linhas.appendChild(celulaEmail);

        // Cria a célula para ações (ícones de editar e excluir)
        const celulaAcoes = document.createElement('td');

        const iconeEditar = document.createElement('img');
        iconeEditar.src = "assets/icons/pencil-square.svg";
        iconeEditar.alt = "editar";
        celulaAcoes.appendChild(iconeEditar);

        const iconeDeletar = document.createElement('img');
        iconeDeletar.src = "assets/icons/trash-fill.svg";
        iconeDeletar.alt = "excluir";
        celulaAcoes.appendChild(iconeDeletar);

        linhas.appendChild(celulaAcoes);

        // Adiciona a linha ao corpo da tabela
        tabela.appendChild(linhas);
    });
}