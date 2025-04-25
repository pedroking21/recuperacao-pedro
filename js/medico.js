/**
 * Envia os dados do formulário de cadastro de médico para o servidor.
 * 
 * Recupera as informações do formulário, cria um objeto JSON com os dados
 * e envia uma requisição POST para o servidor.
 * 
 * Essa função deverá ser vinculada ao evento de clique do botão de envio.
 * 
 * @async
 * @function enviaFormulario
 * @returns {Promise<void>} Retorna uma Promise que resolve quando a operação é concluída.
 * @throws {Error} Lança um erro se a comunicação com o servidor falhar.
 */
async function enviaFormulario() {
    const medicoDTO = {
        "nome": document.querySelector("input[name='input-nome']").value,
        "especialidade": document.querySelector("input[name='input-especialidade-medico']").value,
        "telefone": document.querySelector("input[name='input-telefone-medico']").value,
        "crm": document.querySelector("input[name='input-crm-medico']").value,
        "email": document.querySelector("input[name='input-email']").value
    };

    const validacaoMedico = validacaoFormularioMedico(medicoDTO);

    if (!validacaoMedico) {
        return;
    }

    try {
        const respostaServidor = await fetch("http://localhost:3333/cadastro/medico", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicoDTO)
        });

        if (!respostaServidor.ok) {
            throw new Error("Erro ao enviar os dados para o servidor. Contate o administrador do sistema");
        }

        alert("Médico cadastrado com sucesso!");
        window.location.href = "lista-medicos.html";

    } catch (error) {
        console.log(error);
        alert(`Erro ao se comunicar com o servidor. ${error}`);
    }
}

/**
 * Valida os dados do formulário de cadastro de médico.
 * 
 * Verifica se todos os campos obrigatórios foram preenchidos e se os tipos de dados estão corretos.
 * 
 * @function validacaoFormularioMedico
 * @param {Object} medico - Objeto contendo os dados do médico a serem validados
 * @returns {boolean} Retorna true se os dados são válidos, false caso contrário
 */
function validacaoFormularioMedico(medico) {
    if (medico.nome === "" || medico.especialidade === "" || medico.telefone === "" || medico.crm === "" || medico.email === "") {
        alert("Preencha todos os campos do formulário");
        return false;
    }

    if (isNaN(medico.telefone)) {
        alert("O telefone do médico deve ser um número");
        return false;
    }

    return true;
}

/**
 * Recupera a lista de médicos do servidor e cria uma tabela com os dados.
 * 
 * Faz uma requisição HTTP para o endpoint '/listar/medico' e, se a resposta for bem-sucedida,
 * converte a resposta em JSON e chama a função `criarTabelaMedicos` com a lista de médicos.
 * 
 * Essa função deverá ser invocada ao carregar a página de lista de médicos.
 * 
 * @async
 * @function recuperarListaMedicos
 * @returns {Promise<null>} Retorna null em caso de sucesso ou erro.
 * @throws {Error} Lança um erro se a requisição falhar.
 */
async function recuperarListaMedicos() {
    try {
        const respostaServidor = await fetch('http://localhost:3333/listar/medico');

        if (respostaServidor.ok) {
            const listaMedicos = await respostaServidor.json();
            criarTabelaMedicos(listaMedicos);
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Cria uma tabela HTML com os dados dos médicos.
 * 
 * @async
 * @function criarTabelaMedicos
 * @param {Array} medicos - Lista de médicos a serem exibidos na tabela
 * @returns {Promise<null>} Retorna null em caso de sucesso ou erro
 */
async function criarTabelaMedicos(medicos) {
    try {
        const tBody = document.querySelector(`tbody`);

        medicos.map(medico => {
            const tr = document.createElement('tr');

            const tdIdMedico = document.createElement('td');
            tdIdMedico.textContent = medico.idMedico;
            tr.appendChild(tdIdMedico);

            const tdNome = document.createElement('td');
            tdNome.innerText = medico.nome;
            tr.appendChild(tdNome);

            const tdEspecialidade = document.createElement('td');
            tdEspecialidade.innerText = medico.especialidade;
            tr.appendChild(tdEspecialidade);

            const tdTelefone = document.createElement('td');
            tdTelefone.innerText = medico.telefone;
            tr.appendChild(tdTelefone);

            const tdCrm = document.createElement('td');
            tdCrm.innerText = medico.crm;
            tr.appendChild(tdCrm);

            const tdEmail = document.createElement('td');
            tdEmail.innerText = medico.email;
            tr.appendChild(tdEmail);

            const tdAcoes = document.createElement('td');
            const imgEditar = document.createElement('img');
            imgEditar.src = "./assets/images/pencil-square.svg";
            imgEditar.alt = "Editar";
            imgEditar.onclick = () => enviarInfoParaAtualizacao(medico);
            tdAcoes.appendChild(imgEditar);

            const imgDeletar = document.createElement('img');
            imgDeletar.src = "./assets/images/trash-fill.svg";
            imgDeletar.alt = "Deletar";
            imgDeletar.onclick = () => removerMedico(medico.idMedico);
            tdAcoes.appendChild(imgDeletar);

            tr.appendChild(tdAcoes);
            tBody.append(tr);
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Remove um médico do servidor com base no ID fornecido.
 * 
 * @async
 * @function removerMedico
 * @param {number} idMedico - ID do médico a ser removido
 * @returns {Promise<boolean>} Retorna true se a remoção foi bem-sucedida, false caso contrário
 */
async function removerMedico(idMedico) {
    try {
        const confirmacaoUsuario = confirm("Deseja realmente remover o médico?");

        if (!confirmacaoUsuario) {
            return false;
        }

        const respostaServidor = await fetch(`http://localhost:3333/remover/medico/${idMedico}`, {
            method: 'PUT'
        });

        if (respostaServidor.ok) {
            alert("Médico removido com sucesso!");
            window.location.reload();
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Redireciona o usuário para a página de atualização de médico com as informações do médico fornecido.
 *
 * @param {Object} medico - Objeto contendo as informações do médico a ser atualizado.
 */
function enviarInfoParaAtualizacao(medico) {
    const urlUpdate = `atualizar-medico.html?medico=${JSON.stringify(medico)}`;
    window.location.href = urlUpdate;
}

/**
 * Carrega os dados do formulário com as informações do médico obtidas da URL.
 * A URL deve conter um parâmetro de consulta "medico" com um objeto JSON codificado.
 * 
 * Essa função deverá ser invocada ao carregar a página de atualização de médico.
 */
function carregarDadosFormulario() {
    const url = new URL(window.location.href);
    const medico = JSON.parse(url.searchParams.get("medico"));

    document.querySelectorAll("input")[0].value = medico.idMedico;
    document.querySelectorAll("input")[1].value = medico.nome;
    document.querySelectorAll("input")[2].value = medico.especialidade;
    document.querySelectorAll("input")[3].value = medico.telefone;
    document.querySelectorAll("input")[4].value = medico.crm;
    document.querySelectorAll("input")[5].value = medico.email;
}

/**
 * Atualiza as informações de um médico com base nos dados fornecidos pelo usuário.
 * 
 * Esta função coleta os dados de entrada do usuário, confirma a intenção de atualização,
 * e envia uma requisição PUT para o servidor com os dados do médico. Se a atualização for
 * bem-sucedida, o usuário é redirecionado para a página de lista de médicos.
 * 
 * Essa função deverá ser vinculada ao evento de clique do botão de atualização.
 * 
 * @async
 * @function atualizarMedico
 * @returns {Promise<boolean>} Retorna true se a atualização for bem-sucedida, caso contrário, false.
 */
async function atualizarMedico() {
    const medicoDTO = {
        "idMedico": document.querySelectorAll("input")[0].value,
        "nome": document.querySelectorAll("input")[1].value,
        "especialidade": document.querySelectorAll("input")[2].value,
        "telefone": Number(document.querySelectorAll("input")[3].value),
        "crm": document.querySelectorAll("input")[4].value,
        "email": document.querySelectorAll("input")[5].value
    }

    try {
        const confirmacaoUsuario = confirm("Deseja realmente atualizar o médico?");

        if (!confirmacaoUsuario) {
            return false;
        }

        const validacaoMedico = validacaoFormularioMedico(medicoDTO);

        if (!validacaoMedico) {
            return;
        }

        const respostaServidor = await fetch(`http://localhost:3333/atualizar/medico/${medicoDTO.idMedico}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicoDTO)
        });

        if (respostaServidor.ok) {
            alert("Médico atualizado com sucesso!");
            window.location.href = "lista-medicos.html";
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}