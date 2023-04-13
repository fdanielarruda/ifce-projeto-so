function roundRobin(processos, quantum) {
    var tempoEmExecucao = 0;
    var tempoEspera = 0;
    var tempoRetorno = 0;
    var tempoTroca = 0;

    // indices: 10, 15 e 20
    var vazao = Array(3).fill(0);

    // ARRAY PARA MONITORAR O TEMPO DE EXECUÇÃO DE CADA PROCESSO
    var tempoExecucao = [];

    processos.map(e => tempoExecucao.push({ id: e.id, tempo: 0 }));

    var fila = [...processos];

    var primeiraExecucao = true;
    
    while (fila.length > 0) {
        !primeiraExecucao ? tempoTroca++ : primeiraExecucao = false;

        var processoAtual = fila.shift();
        var tempoExecucaoAtual = Math.min(quantum, processoAtual.tempoRestante);
        var index = 0;

        tempoExecucao.map((e, i) => {
            if (e.id === processoAtual.id) index = i;
        })
        
        // ATUALIZANDO OS TEMPOS DE EXECUÇÃO E DE ESPERA DO PROCESSO ATUAL
        processoAtual.tempoRestante -= tempoExecucaoAtual;
        tempoExecucao[index].tempo += tempoExecucaoAtual;
        tempoEmExecucao += tempoExecucaoAtual;

        if (processoAtual.tempoRestante > 0) {
            // CASO O PROCESSO NAO TENHA SIDO CONCLUÍDO É NOVAMENTE ADICIONADO A FILA
            fila.push(processoAtual);

            tempoEspera += quantum;
        } else {
            tempoEspera += tempoEmExecucao - processoAtual.tempoChegada - processoAtual.tempoExecucao + tempoTroca;
            tempoRetorno += tempoEmExecucao + tempoTroca;

            if (tempoEmExecucao + tempoTroca <= 10) vazao[0]++;
            if (tempoEmExecucao + tempoTroca <= 15) vazao[1]++;
            if (tempoEmExecucao + tempoTroca <= 20) vazao[2]++;
        }
    }

    var tempoMedioEspera = tempoEspera / processos.length;
    var tempoMedioRetorno = tempoRetorno / processos.length;
    var tempoTotal = tempoEmExecucao + tempoTroca;

    return [tempoMedioEspera, tempoMedioRetorno, tempoTotal, vazao];
}

// LISTA DE PROCESSOS A SEREM EXECUTADOS
var processos = [
    { id: 1, tempoChegada: 0, tempoExecucao: 5, tempoRestante: 5 },
    { id: 2, tempoChegada: 0, tempoExecucao: 3, tempoRestante: 3 },
    { id: 3, tempoChegada: 0, tempoExecucao: 4, tempoRestante: 4 },
    { id: 4, tempoChegada: 0, tempoExecucao: 2, tempoRestante: 2 },
    { id: 5, tempoChegada: 0, tempoExecucao: 1, tempoRestante: 1 }
];

// TAMANHO DO QUANTUM
var quantum = 4;

// EXECUÇÃO DO ALGORITMO ROUND ROBIN
var [tempoEspera, tempoRetorno, tempoExecucao, vazao] = roundRobin(processos, quantum);

console.log("Tempo médio de espera: " + tempoEspera);
console.log("Tempo médio de retorno: " + tempoRetorno);
console.log("Tempo total de execução: " + tempoExecucao);
console.log("Vazão em 10: " + vazao[0]);
console.log("Vazão em 15: " + vazao[1]);
console.log("Vazão em 20: " + vazao[2]);