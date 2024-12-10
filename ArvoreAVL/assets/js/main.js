document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formArvore");
    const resultados = document.getElementById("resultados");
    const containerEtapas = document.getElementById("containerEtapas");
    const visualizacaoArvore = document.getElementById("visualizacaoArvore");
    const botaoVerEtapas = document.getElementById("verEtapas");
    const botaoProximaEtapa = document.getElementById("proximaEtapa");

    let etapasArvore = [];
    let etapaAtual = 0;

    // Evento de envio do formulário
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const entrada = document.getElementById("numeros").value;
        const numeros = entrada.split(",").map(Number);

        // Construir etapas da árvore AVL
        etapasArvore = construirEtapasAVL(numeros);
        document.getElementById("etapas").textContent = `Número de etapas: ${etapasArvore.length}`;
        resultados.style.display = "block";
    });

    // Mostrar etapas ao clicar no botão
    botaoVerEtapas.addEventListener("click", () => {
        resultados.style.display = "none";
        containerEtapas.style.display = "block";
        exibirEtapa(0);
    });

    // Mostrar próxima etapa
    botaoProximaEtapa.addEventListener("click", () => {
        etapaAtual++;
        if (etapaAtual < etapasArvore.length) {
            exibirEtapa(etapaAtual);
        } else {
            alert("Construção concluída!");
        }
    });

    // Exibir etapa específica
    function exibirEtapa(indiceEtapa) {
        const etapa = etapasArvore[indiceEtapa];
        if (etapa) {
            visualizacaoArvore.innerHTML = etapa.visual;
            document.getElementById("informacoesEtapa").innerHTML = `
                <p>Etapa: ${indiceEtapa + 1}</p>
                <p>Status: ${etapa.balanceamento ? "Balanceamento necessário" : "Sem balanceamento"}</p>
                ${etapa.tipoBalanceamento ? `<p>Tipo: ${etapa.tipoBalanceamento}</p>` : ""}
            `;
        }
    }

    // Construir etapas da árvore AVL
    function construirEtapasAVL(numeros) {
        class Nodo {
            constructor(chave) {
                this.chave = chave;
                this.altura = 1;
                this.esquerda = null;
                this.direita = null;
            }
        }

        class AVL {
            constructor() {
                this.raiz = null;
                this.etapas = [];
            }

            altura(nodo) {
                return nodo ? nodo.altura : 0;
            }

            fatorBalanceamento(nodo) {
                if (!nodo) return 0;
                return this.altura(nodo.esquerda) - this.altura(nodo.direita);
            }

            rotacaoDireita(nodoY) {
                const nodoX = nodoY.esquerda;
                const nodoT = nodoX.direita;

                nodoX.direita = nodoY;
                nodoY.esquerda = nodoT;

                nodoY.altura = 1 + Math.max(this.altura(nodoY.esquerda), this.altura(nodoY.direita));
                nodoX.altura = 1 + Math.max(this.altura(nodoX.esquerda), this.altura(nodoX.direita));

                return nodoX;
            }

            rotacaoEsquerda(nodoX) {
                const nodoY = nodoX.direita;
                const nodoT = nodoY.esquerda;

                nodoY.esquerda = nodoX;
                nodoX.direita = nodoT;

                nodoX.altura = 1 + Math.max(this.altura(nodoX.esquerda), this.altura(nodoX.direita));
                nodoY.altura = 1 + Math.max(this.altura(nodoY.esquerda), this.altura(nodoY.direita));

                return nodoY;
            }

            inserir(raiz, chave) {
                if (!raiz) {
                    const novoNodo = new Nodo(chave);
                    this.etapas.push(this.salvarEtapa(false));
                    return novoNodo;
                }

                if (chave < raiz.chave) {
                    raiz.esquerda = this.inserir(raiz.esquerda, chave);
                } else if (chave > raiz.chave) {
                    raiz.direita = this.inserir(raiz.direita, chave);
                } else {
                    return raiz;
                }

                raiz.altura = 1 + Math.max(this.altura(raiz.esquerda), this.altura(raiz.direita));
                const balanceamento = this.fatorBalanceamento(raiz);

                // Verificar balanceamento e aplicar rotações
                if (balanceamento > 1 && chave < raiz.esquerda.chave) {
                    this.etapas.push(this.salvarEtapa(true, "Rotação Direita"));
                    return this.rotacaoDireita(raiz);
                }

                if (balanceamento < -1 && chave > raiz.direita.chave) {
                    this.etapas.push(this.salvarEtapa(true, "Rotação Esquerda"));
                    return this.rotacaoEsquerda(raiz);
                }

                if (balanceamento > 1 && chave > raiz.esquerda.chave) {
                    raiz.esquerda = this.rotacaoEsquerda(raiz.esquerda);
                    this.etapas.push(this.salvarEtapa(true, "Rotação Esquerda-Direita"));
                    return this.rotacaoDireita(raiz);
                }

                if (balanceamento < -1 && chave < raiz.direita.chave) {
                    raiz.direita = this.rotacaoDireita(raiz.direita);
                    this.etapas.push(this.salvarEtapa(true, "Rotação Direita-Esquerda"));
                    return this.rotacaoEsquerda(raiz);
                }

                this.etapas.push(this.salvarEtapa(false));
                return raiz;
            }

            salvarEtapa(balanceamento, tipoBalanceamento = null) {
                return {
                    visual: this.gerarHTML(this.raiz, balanceamento),
                    balanceamento,
                    tipoBalanceamento
                };
            }

            gerarHTML(nodo, balanceamento) {
                if (!nodo) return "";
                const cor = balanceamento ? "red" : "green";
                return `
                    <div class="nodo" style="border-color: ${cor};">
                        <div class="chave">${nodo.chave}</div>
                        <div class="filhos">
                            <div class="esquerda">${this.gerarHTML(nodo.esquerda, balanceamento)}</div>
                            <div class="direita">${this.gerarHTML(nodo.direita, balanceamento)}</div>
                        </div>
                    </div>
                `;
            }

            inserirNumeros(numeros) {
                for (const num of numeros) {
                    this.raiz = this.inserir(this.raiz, num);
                }
                return this.etapas;
            }
        }

        const arvore = new AVL();
        return arvore.inserirNumeros(numeros);
    }
});
