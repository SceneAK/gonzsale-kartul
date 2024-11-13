const { expect } = require('chai');
const { getFilePath } = require('../src/modules/upload');
const { PUBLIC_DIR } = require('../src/server')
const upath = require('upath');

describe('File Path Test', ()=>{
    it('should return paths correctly', ()=>{
        expect(getFilePath("https://localhost:3000/source/images/abcd")).to.equal( upath.join(PUBLIC_DIR, 'images/abcd'));
    })
})