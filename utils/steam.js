const axios = require('axios');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'users.txt');

function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const lines = data.trim().split('\n');
    const users = [];
    const userNames = {};
    for (const line of lines) {
      if (!line.trim()) continue; // ignora linhas vazias
      const [api_key, steam_id, name] = line.split(',').map(s => s.trim());
      users.push({ api_key, steam_id });
      userNames[steam_id] = name;
    }
    return { users, userNames };
  } catch (err) {
    console.error('Erro ao carregar users.txt:', err.message);
    return { users: [], userNames: {} };
  }
}

async function getUserGames(api_key, steam_id) {
  const url = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/';
  const params = {
    key: api_key,
    steamid: steam_id,
    include_appinfo: true,
    format: 'json'
  };

  try {
    const response = await axios.get(url, { params });
    return response.data.response?.games || [];
  } catch (err) {
    console.error(`Erro ao buscar jogos de ${steam_id}:`, err.message);
    return [];
  }
}

async function aggregateGames() {
  const { users, userNames } = loadUsers();
  const aggregated = {};

  console.log('=== Iniciando busca de jogos ===');
  console.log(`Total de usuários carregados: ${users.length}`);
  console.log('Usuários:', Object.values(userNames).join(', '));

  for (const user of users) {
    console.log(`\nBuscando jogos para ${userNames[user.steam_id]}...`);
    const games = await getUserGames(user.api_key, user.steam_id);
    console.log(`✓ ${games.length} jogos encontrados para ${userNames[user.steam_id]}`);
    
    for (const game of games) {
      const appid = String(game.appid);
      const name = game.name || 'Desconhecido';

      if (aggregated[appid]) {
        if (!aggregated[appid].owners.includes(user.steam_id)) {
          aggregated[appid].copies += 1;
          aggregated[appid].owners.push(user.steam_id);
        }
      } else {
        aggregated[appid] = {
          appid,
          name,
          copies: 1,
          owners: [user.steam_id]
        };
      }
    }
  }

  const totalGames = Object.keys(aggregated).length;
  console.log(`\n=== Agregação completa ===`);
  console.log(`Total de jogos únicos: ${totalGames}`);
  console.log('===========================\n');

  return { aggregated, userNames };
}

// 🔑 Exportação correta
module.exports = { loadUsers, aggregateGames };