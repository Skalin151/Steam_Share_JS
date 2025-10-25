const express = require('express');
const path = require('path');
const { aggregateGames, loadUsers } = require('./utils/steam');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

// Carrega variáveis de ambiente
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1515;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Rota principal
app.get('/', async (req, res) => {
  const { users, userNames } = loadUsers();
  const userOptions = Object.values(userNames);

  let { aggregated } = await aggregateGames();

  // Filtros e busca
  let filtered = aggregated;
  const search = (req.query.search || '').toLowerCase();
  const userFilter = req.query.userFilter || 'All';
  const sortOrder = req.query.sortOrder || 'Name (A-Z)';

  // Aplicar busca
  if (search) {
    filtered = Object.fromEntries(
      Object.entries(aggregated).filter(([_, game]) =>
        game.name.toLowerCase().includes(search) || game.appid.includes(search)
      )
    );
  }

  // Aplicar filtro por usuário
  if (userFilter !== 'All') {
    const steamId = Object.keys(userNames).find(id => userNames[id] === userFilter);
    if (steamId) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, game]) =>
          game.owners.includes(steamId)
        )
      );
    }
  }

  // Ordenação
  let sortedEntries = Object.entries(filtered);
  if (sortOrder === 'Name (A-Z)') {
    sortedEntries.sort((a, b) => a[1].name.localeCompare(b[1].name));
  } else if (sortOrder === 'Name (Z-A)') {
    sortedEntries.sort((a, b) => b[1].name.localeCompare(a[1].name));
  } else if (sortOrder === 'Copies (Asc)') {
    sortedEntries.sort((a, b) => a[1].copies - b[1].copies);
  } else if (sortOrder === 'Copies (Desc)') {
    sortedEntries.sort((a, b) => b[1].copies - a[1].copies);
  }

  const games = sortedEntries.map(([appid, data]) => ({
    ...data,
    owners: data.owners.map(id => userNames[id] || id).join(', ')
  }));

  res.render('index', {
    games,
    userOptions,
    search: req.query.search || '',
    userFilter: userFilter,
    sortOrder: sortOrder
  });
});

// Exportar CSV
app.get('/export-csv', async (req, res) => {
  const { aggregated, userNames } = await aggregateGames();

  const csvWriter = createCsvWriter({
    path: 'steam_games_aggregated.csv',
    header: [
      { id: 'appid', title: 'AppID' },
      { id: 'name', title: 'Game Name' },
      { id: 'copies', title: 'Copies' },
      { id: 'owners', title: 'Owners' }
    ]
  });

  const records = Object.values(aggregated).map(game => ({
    appid: game.appid,
    name: game.name,
    copies: game.copies,
    owners: game.owners.map(id => userNames[id] || id).join(', ')
  }));

  await csvWriter.writeRecords(records);
  res.download('steam_games_aggregated.csv', (err) => {
    if (err) console.error(err);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});