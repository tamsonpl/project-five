#!/usr/bin/env node
/**
 * HOMELUXE demo API — dependency-free Node HTTP service.
 * Persists newsletter signups, valuation requests and contact messages
 * as JSON files under DATA_DIR. Served behind nginx at /api/*.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3500;
const DATA_DIR = process.env.DATA_DIR || '/srv/data';
const MAX_BODY = 32 * 1024;

try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) { /* may already exist */ }

/* ---------- tiny JSON file store ---------- */
const fileFor = (name) => path.join(DATA_DIR, name + '.json');
function readList(name) {
  try { return JSON.parse(fs.readFileSync(fileFor(name), 'utf8')); }
  catch (e) { return []; }
}
let writeChain = Promise.resolve();
function append(name, record) {
  writeChain = writeChain.then(() => {
    const list = readList(name);
    list.push(record);
    const tmp = fileFor(name) + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
    fs.renameSync(tmp, fileFor(name));
    return record;
  });
  return writeChain;
}

/* ---------- validation helpers ---------- */
const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 200);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => /^[+()\d][\d\s().-]{6,19}$/.test(v);

function bad(res, code, message) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}
function ok(res, payload) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('Payload too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch (e) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

/* ---------- routes ---------- */
const server = http.createServer(async (req, res) => {
  const url = (req.url || '').split('?')[0];

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (req.method === 'GET' && url === '/api/health') {
    return ok(res, { ok: true, service: 'homeluxe-api' });
  }

  if (req.method !== 'POST') return bad(res, 405, 'Method not allowed');
  if (url !== '/api/newsletter' && url !== '/api/valuation' && url !== '/api/contact') {
    return bad(res, 404, 'Not found');
  }

  let body;
  try { body = await readBody(req); }
  catch (e) { return bad(res, 400, e.message === 'Payload too large' ? 'Payload too large' : 'Invalid JSON body'); }

  const email = clean(body.email, 254).toLowerCase();
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const now = new Date().toISOString();

  if (url === '/api/newsletter') {
    if (!isEmail(email)) return bad(res, 400, 'Please provide a valid email address.');
    const existing = readList('newsletter').find((s) => s.email === email);
    if (existing) return bad(res, 409, 'This email is already subscribed.');
    const record = { id: now + '-' + Math.random().toString(36).slice(2, 8), email, consent: body.consent === true, status: 'subscribed', createdAt: now };
    await append('newsletter', record);
    console.log('[newsletter] new subscriber', email);
    return ok(res, { ok: true, id: record.id });
  }

  if (url === '/api/valuation') {
    if (!name) return bad(res, 400, 'Name is required.');
    if (!isEmail(email)) return bad(res, 400, 'Please provide a valid email address.');
    if (!isPhone(phone)) return bad(res, 400, 'Please provide a valid phone number.');
    const address = clean(body.address, 300);
    if (address.length < 5) return bad(res, 400, 'Property address is required.');
    const est = Number(body.estimatedValue);
    const record = {
      id: now + '-' + Math.random().toString(36).slice(2, 8),
      name, email, phone, address,
      propertyType: clean(body.propertyType, 60) || 'House',
      estimatedValue: Number.isFinite(est) && est >= 0 ? est : null,
      status: 'new', createdAt: now
    };
    await append('valuations', record);
    console.log('[valuation] request from', email);
    return ok(res, { ok: true, id: record.id });
  }

  /* /api/contact */
  if (!name) return bad(res, 400, 'Name is required.');
  if (!isEmail(email)) return bad(res, 400, 'Please provide a valid email address.');
  if (phone && !isPhone(phone)) return bad(res, 400, 'Please provide a valid phone number.');
  const subject = clean(body.subject, 200);
  const message = clean(body.message, 4000);
  if (!subject) return bad(res, 400, 'Subject is required.');
  if (message.length < 10) return bad(res, 400, 'Message is too short.');
  const record = {
    id: now + '-' + Math.random().toString(36).slice(2, 8),
    name, email, phone,
    subject, message,
    property: clean(body.property, 120) || null,
    status: 'new', createdAt: now
  };
  await append('contacts', record);
  console.log('[contact] message from', email, '—', subject);
  return ok(res, { ok: true, id: record.id });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('HOMELUXE demo API listening on port', PORT);
  console.log('Data directory:', DATA_DIR);
});
