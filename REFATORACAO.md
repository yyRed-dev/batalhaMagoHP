# Relatório de Refatoração - Wizard Duel

## Problemas Encontrados

Durante a análise do projeto foram identificados os seguintes problemas de qualidade de código:

### 1. Números Mágicos

O código possuía diversos valores literais espalhados pela aplicação sem contexto explícito.

Exemplos:

* Valores de atributos dos personagens
* Quantidade de cartas por pack
* Quantidade de cartas do deck da CPU
* Quantidade de feitiços
* Valores de dano dos feitiços
* Porta do servidor

### 2. Nomes Sem Significado

Foram encontrados diversos nomes de variáveis que não descreviam sua finalidade.

Exemplos:

* d
* r
* tmp
* c
* a
* obj
* x
* y
* z
* pw
* mg
* df
* pg

### 3. Código Duplicado

Havia duplicação de lógica em diferentes rotas.

Exemplos:

* Cálculo de atributos dos personagens
* Embaralhamento de listas
* Construção de objetos de personagem

### 4. Múltiplas Responsabilidades

O arquivo principal concentrava diversas responsabilidades:

* Inicialização do servidor
* Comunicação com a API externa
* Cálculo de atributos
* Processamento de personagens
* Definição de rotas

O frontend também possuía HTML, CSS e JavaScript concentrados em um único arquivo.

### 5. Code Smells

Foram identificados:

* Uso excessivo de variáveis genéricas
* Operadores de comparação pouco consistentes
* Concatenação excessiva de strings
* Estrutura de arquivos pouco organizada

---

## Decisões Tomadas

### Extração de Constantes

Foi criado o arquivo:

```txt
constants.js
```

para centralizar todos os valores fixos da aplicação.

### Eliminação de Código Duplicado

Foram criadas funções reutilizáveis para:

* Cálculo de atributos
* Construção de personagens
* Embaralhamento de listas
* Busca de personagens na API

### Separação de Responsabilidades

O backend foi reorganizado na seguinte estrutura:

```txt
wizard-duel/
├── index.js
├── constants.js
├── routes/
│   ├── characters.js
│   └── spells.js
├── services/
│   ├── potterApi.js
│   └── statsCalculator.js
```

O frontend foi reorganizado em:

```txt
public/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── api.js
    ├── render.js
    └── game.js
```

---

## Histórico de Refatoração

### Commit 1

Renomeação de variáveis e funções para nomes mais significativos.

### Commit 2

Extração de números mágicos para constantes nomeadas.

### Commit 3

Remoção de código duplicado através da criação de funções reutilizáveis.

### Commit 4A

Separação das responsabilidades do backend em rotas, serviços e constantes.

### Commit 4B

Separação das responsabilidades do frontend em HTML, CSS e JavaScript.

### Commit 5

Correção de code smells e melhorias gerais de qualidade de código.

---

## Resultado Final

Após a refatoração o projeto apresenta:

* Melhor organização estrutural
* Maior legibilidade
* Redução de duplicação
* Maior reutilização de código
* Separação clara de responsabilidades
* Facilidade de manutenção
* Facilidade de expansão futura

A aplicação foi testada após cada etapa de refatoração para garantir a manutenção do comportamento original.
