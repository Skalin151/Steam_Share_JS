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

Cria um ficheiro `users.txt` na raiz do projeto com o formato:

```
API_KEY,STEAM_ID,NOME_UTILIZADOR
API_KEY,STEAM_ID,NOME_UTILIZADOR
```

**Exemplo:**
```
ABC123XYZ,76561198012345678,João
ABC123XYZ,76561198087654321,Maria
```

## ▶️ Executar

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🐳 Docker

```bash
# Construir a imagem
docker build -t steam-share-app .

# Rodar o container
docker run -p 3000:3000 -v ${PWD}/users.txt:/app/users.txt steam-share-app
```

## 📦 Funcionalidades

- ✅ Visualizar todos os jogos agregados
- 🔍 Pesquisar por nome ou AppID
- 👥 Filtrar por utilizador
- 🔄 Ordenar por nome ou número de cópias
- 📊 Exportar para CSV

