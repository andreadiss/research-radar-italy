import test from 'node:test';
import assert from 'node:assert/strict';
import { extractCallTitles } from './mur-titles.mjs';
import { extractTableFields } from './mur-html.mjs';
test('assignment titles include source spelling variation',()=>{
 const fields=extractTableFields("<th>Titolo del progetto dell'incarico in italiano</th><td>Progetto verificato</td><th>Titolo del progetto ddell'incarico in inglese</th><td>Verified project</td>");
 assert.deepEqual(extractCallTitles(fields),{title:'Progetto verificato',titleEn:'Verified project'});
});
test('existing research titles retain priority over generic titles',()=>{
 assert.deepEqual(extractCallTitles({'Titolo del progetto di ricerca in italiano':'Ricerca','Titolo':'Generico'}),{title:'Ricerca',titleEn:''});
});
test('missing and blank titles remain empty, without invented information',()=>{
 assert.deepEqual(extractCallTitles({'Titolo':'  '}),{title:'',titleEn:''});
});
