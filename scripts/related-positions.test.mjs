import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync('lib/related-positions.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const { relatedPositions } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const item = (id, extra={}) => ({id,sourceUrl:`https://example.test/${id}`,discipline:'Fisica',positionType:'RTT',deadline:'2026-09-20',...extra});
test('related results exclude self, expired, archived, other roles and possible duplicates', () => {
 const current=item('a');
 const candidates=[current,item('b',{deadline:'2026-09-04'}),item('c',{archivedAt:'2026-09-01'}),item('d',{positionType:'PhD'}),item('e',{possibleDuplicateOf:'a'}),item('f'),item('g',{deadline:'unknown'})];
 assert.deepEqual(relatedPositions(current,candidates,'2026-09-05').map(x=>x.id),['f']);
});
test('results are bounded, stable and nearest deadline first',()=>{
 assert.deepEqual(relatedPositions(item('a'),[item('z'),item('y'),item('b',{deadline:'2026-09-05'}),item('x')],'2026-09-05').map(x=>x.id),['b','x','y']);
});
test('broad categories never create unrelated fallback results',()=>{
 assert.deepEqual(relatedPositions(item('a',{discipline:'Altro / interdisciplinare'}),[item('b')],'2026-09-05'),[]);
});
