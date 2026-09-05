import test from 'node:test';
import assert from 'node:assert/strict';
import { meaningfulRequirements } from '../lib/requirements.mjs';
import { toPosition } from './mur-normalize.mjs';
test('bare links, blank values and placeholders do not become requirements',()=>{
 assert.deepEqual(meaningfulRequirements(['https://example.test/apply','www.example.test','mailto:office@example.test','Other','Non specificato','',null]),[]);
});
test('factual requirements remain intact, including sentences containing a link',()=>{
 const sentence='Requisiti completi disponibili su https://example.test/bando';
 assert.deepEqual(meaningfulRequirements([' Laurea magistrale ','Laurea magistrale',sentence]),['Laurea magistrale',sentence]);
});
test('importer gives an explicit official-source fallback for link-only application instructions',()=>{
 const position=toPosition({externalId:'test',positionType:'RTT',institution:'Università test',title:'Ricerca',deadline:'2026-09-30',sourceUrl:'https://example.test/call',applicationMode:'https://example.test/apply'});
 assert.deepEqual(position.requirements,['Requisiti indicati nel bando ufficiale']);
});
