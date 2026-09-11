import test from 'node:test';
import assert from 'node:assert/strict';
import { extractCallTitles } from './mur-titles.mjs';
import { extractTableFields } from './mur-html.mjs';
test('postdoc project labels preserve both official language titles',()=>{
 const fields=extractTableFields('<tr><th>Titolo del progetto in italiano</th><td>Studio sui bacini e impianti fotovoltaici</td></tr><tr><th>Titolo del progetto in inglese</th><td>Study of reservoirs and photovoltaic systems</td></tr>');
 assert.deepEqual(extractCallTitles(fields),{title:'Studio sui bacini e impianti fotovoltaici',titleEn:'Study of reservoirs and photovoltaic systems'});
});
test('new postdoc labels do not override existing specific labels',()=>{
 assert.deepEqual(extractCallTitles({'Titolo del progetto di ricerca in italiano':'Ricerca','Titolo del progetto in italiano':'Alternativo','Titolo del progetto di ricerca in inglese':'Research','Titolo del progetto in inglese':'Alternative'}),{title:'Ricerca',titleEn:'Research'});
});
test('blank postdoc fields retain fallback without translating or inventing titles',()=>{
 assert.deepEqual(extractCallTitles({'Titolo del progetto in italiano':'  ','Titolo':'Generico','Titolo del progetto in inglese':'English only'}),{title:'Generico',titleEn:'English only'});
});
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
