import test from 'node:test';
import assert from 'node:assert/strict';
import { hasCurrentFundingConfirmation } from './funding-review-state.mjs';
const item={fundingType:'MSCA',sourceUrl:'https://example.test/call',updatedAt:'2026-09-01T00:00:00Z'};
const review={after:'MSCA',sourceUrl:item.sourceUrl,checkedAt:'2026-09-05T00:00:00Z'};
test('unchanged record retains official confirmation',()=>assert.equal(hasCurrentFundingConfirmation(item,review),true));
test('changes to source, funding or record invalidate confirmation',()=>{
 for(const change of [{sourceUrl:'https://example.test/new'},{fundingType:'ERC'},{updatedAt:'2026-09-06T00:00:00Z'}]) assert.equal(hasCurrentFundingConfirmation({...item,...change},review),false);
});
test('missing or malformed evidence timestamps require review',()=>{
 assert.equal(hasCurrentFundingConfirmation(item,null),false);
 assert.equal(hasCurrentFundingConfirmation({...item,updatedAt:undefined},review),false);
 assert.equal(hasCurrentFundingConfirmation(item,{...review,checkedAt:'unknown'}),false);
});
