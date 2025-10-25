# Steam Share JS

Aplicação web para visualizar e comparar bibliotecas de jogos Steam entre múltiplos utilizadores.

## 📋 Requisitos

- Node.js 18+
- Chave API da Steam ([obter aqui](https://steamcommunity.com/dev/apikey))
- Steam ID dos utilizadores

## 🚀 Instalação

```bash
npm install
```

## ⚙️ Configuração

Cria um ficheiro `.env` na raiz do projeto (copia o `.env.example`):

```bash
cp .env.example .env
```

Edita o ficheiro `.env` com os teus dados:

```env
PORT=1515

# Utilizador 1
USER_1_API_KEY=SUA_CHAVE_API_STEAM
USER_1_STEAM_ID=76561198012345678
USER_1_NAME=João

# Utilizador 2
USER_2_API_KEY=SUA_CHAVE_API_STEAM
USER_2_STEAM_ID=76561198087654321
USER_2_NAME=Maria
```

Podes adicionar mais utilizadores seguindo o padrão `USER_3`, `USER_4`, etc.

## ▶️ Executar

```bash
npm start
```

A aplicação estará disponível em `http://localhost:1515`

## 🐳 Docker

### Com Docker Compose (Recomendado)

```bash
# Iniciar a aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar a aplicação
docker-compose down
```

### Com Docker (Manual)

```bash
# Construir a imagem
docker build -t steam-share-app .

# Rodar o container
docker run -p 1515:1515 --env-file .env steam-share-app
```

## 📦 Funcionalidades

- ✅ Visualizar todos os jogos agregados
- 🔍 Pesquisar por nome ou AppID
- 👥 Filtrar por utilizador
- 🔄 Ordenar por nome ou número de cópias
- 📊 Exportar para CSV

