async function cadastrarMedico() {
    // Recuperar informações do formulário e criar objeto JSON
    const medicoDTO = {
        "nome": document.querySelector("input[name='input-nome']").value,
        "especialidade": document.querySelector("input[name='input-especialidade-medico']").value,
        "crm": document.querySelector("input[name='input-crm-medico']").value,
        "email": document.querySelector("input[name='input-email']").value
    };

    console.log(medicoDTO);

    try {
        const respostaServidor = await fetch("http://localhost:3333/novo/medico", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livroDTO)
        });

        if (!respostaServidor.ok) {
            throw new Error("Erro ao enviar os dados para o servidor. Contate o administrador do sistema.");
        }

        alert("Medico cadastrado com sucesso!");
    } catch (error) {
        console.log(error);
        alert(`Erro ao se comunicar com o servidor: ${error}`);
    }
}
