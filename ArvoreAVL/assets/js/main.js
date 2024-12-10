document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formArvore")
    const resultados = document.getElementById("resultados")
    const containerEtapas = document.getElementById("containerEtapas")
    const visualizacaoArvore = document.getElementById("visualizacaoArvore")
    const botaoVerEtapas = document.getElementById("verEtapas")
    const botaoProximaEtapa = document.getElementById("proximaEtapa")

    let etapasArvore = []
    let etapaAtual = 0

    formulario.addEventListener("submit", (e) => {
        e.preventDefault()
        const entrada = document.getElementById("numeros").value
        const numeros = entrada.split(",").map(Number)
        etapasArvore = construirEtapasAVL(numeros) // Função a ser implementada
        document.getElementById("etapas").textContent = `Número de etapas: ${etapasArvore.length}`
        resultados.style.display = "block"
    });

    botaoVerEtapas.addEventListener("click", () => {
        resultados.style.display = "none"
        containerEtapas.style.display = "block"
        exibirEtapa(0)
    });

    botaoProximaEtapa.addEventListener("click", () => {
        etapaAtual++
        if (etapaAtual < etapasArvore.length) {
            exibirEtapa(etapaAtual)
        } else {
            alert("Construção concluída!")
        }
    })

    function exibirEtapa(indiceEtapa) {
        const etapa = etapasArvore[indiceEtapa];
        visualizacaoArvore.innerHTML = etapa.visual // Atualizar com HTML da etapa
    }

    function construirEtapasAVL(numeros) {
        // Lógica para construir a árvore AVL e retornar etapas com visualizações
        return []
    }
});
