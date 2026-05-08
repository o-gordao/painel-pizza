const express = require('express');
const fetch   = require('node-fetch');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Tokens (podem ser sobrescritos por variáveis de ambiente no Railway)
const FOODY_TOKEN = process.env.FOODY_TOKEN || 'b98e63d4a1ab4076934272af225c1b2e';
const CW_TOKEN    = process.env.CW_TOKEN    || 'bhpnfiscTLCLeA7NDA8NP1pKcV8Lo8Wxyg5pAivu';

app.use(express.static(path.join(__dirname, 'public')));

// ─── Foody Delivery ───────────────────────────────────────────
app.get('/api/foody', async (req, res) => {
  const hoje = req.query.date || new Date().toISOString().slice(0, 10);
  const url  = `https://app.foodydelivery.com/rest/1.2/orders?startDate=${hoje}T00:00:00-03:00&endDate=${hoje}T23:59:59-03:00`;
  try {
    const r    = await fetch(url, {
      headers: {
        'Authorization': FOODY_TOKEN,
        'Content-Type' : 'application/json;charset=UTF-8'
      },
      timeout: 20000
    });
    const data = await r.json();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ─── Cardápio Web ─────────────────────────────────────────────
app.get('/api/cardapio', async (req, res) => {
  const hoje = req.query.date || new Date().toISOString().slice(0, 10);
  const url  = `https://integracao.cardapioweb.com/api/partner/v1/orders/history?start_date=${hoje}T00:00:00-03:00&end_date=${hoje}T23:59:59-03:00`;
  try {
    const r    = await fetch(url, {
      headers: {
        'X-API-KEY': CW_TOKEN,
        'Accept'   : 'application/json'
      },
      timeout: 20000
    });
    const data = await r.json();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ─── Health check ─────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🍕 Painel Pizza Hollywood rodando na porta ${PORT}`);
});
