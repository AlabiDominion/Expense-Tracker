import test from 'node:test';
import assert from 'node:assert/strict';
import { initials } from '../src/utils/profile.js';

test('profile initials come from the current name, including single names',()=>{
 assert.equal(initials('Alabi Dominion'),'AD');
 assert.equal(initials('  Jane   Mary Doe  '),'JM');
 assert.equal(initials('Ada'),'A');
 assert.equal(initials(),'DG');
});
