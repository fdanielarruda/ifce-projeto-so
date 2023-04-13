#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <time.h>

#define NUMERO_FILOSOFOS 5
#define TEMPO_MAXIMO_PENSANDO 5
#define TEMPO_MAXIMO_COMENDO 3
#define LIMITE_EXECUCOES 1000

pthread_mutex_t garfos[NUMERO_FILOSOFOS];

// VARIÁVEL PARA CONTAR O NÚMERO DE REPETIÇÕES
int execucoes = 0;

void *filosofo(void *arg)
{
    int id = *(int *)arg;
    int garfo_esquerda = id;
    int garfo_direita = (id + 1) % NUMERO_FILOSOFOS;

    while (execucoes < LIMITE_EXECUCOES)
    {
        printf("Filosofo %d esta pensando.\n", id);

        // SLEEP PARA SIMULAR O TEMPO DE PENSAMENTOS DO FILOSÓFO
        sleep(rand() % TEMPO_MAXIMO_PENSANDO + 1);

        printf("Filosofo %d quer comer.\n", id);

        // TENTAR PEGAR O GARFO DA ESQUERDA
        pthread_mutex_lock(&garfos[garfo_esquerda]);

        // TENTAR PEGAR O GARFO DA DIREITA
        if (pthread_mutex_trylock(&garfos[garfo_direita]) != 0)
        {
            // LIBERA O GARFO DA ESQUERDA CASO NN CONSIGA PEGAR O DA DIREITA
            pthread_mutex_unlock(&garfos[garfo_esquerda]);
            printf("Filosofo %d nao conseguiu pegar o garfo da direita.\n", id);
            continue;
        }

        printf("Filosofo %d esta comendo.\n", id);

        // SLEEP PARA SIMULAR O TEMPO EM QUE O FILOSÓFO COME
        sleep(rand() % TEMPO_MAXIMO_COMENDO + 1);

        printf("Filosofo %d acabou de comer.\n", id);

        // LIBERA OS GARFOS
        pthread_mutex_unlock(&garfos[garfo_esquerda]);
        pthread_mutex_unlock(&garfos[garfo_direita]);

        execucoes++;
    }
}

int main()
{
    int i;
    pthread_t tid[NUMERO_FILOSOFOS];
    int id[NUMERO_FILOSOFOS];

    // INICIALIZAR A BIBLIOTECA DE NÚMEROS ALEATÓRIOS
    srand(time(NULL));

    // INICIALIZAR OS MUTEXES
    for (i = 0; i < NUMERO_FILOSOFOS; i++)
    {
        pthread_mutex_init(&garfos[i], NULL);
    }

    // CRIAR AS THREADS DOS FILÓSOFOS
    for (i = 0; i < NUMERO_FILOSOFOS; i++)
    {
        id[i] = i;
        pthread_create(&tid[i], NULL, filosofo, (void *)&id[i]);
    }

    // AGUARDAR AS THREADS TERMINAREM
    for (i = 0; i < NUMERO_FILOSOFOS; i++)
    {
        pthread_join(tid[i], NULL);
    }

    // DESTRUIR OS MUTEXES
    for (i = 0; i < NUMERO_FILOSOFOS; i++)
    {
        pthread_mutex_destroy(&garfos[i]);
    }

    return 0;
}
