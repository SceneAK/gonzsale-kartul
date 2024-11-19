import {expect} from 'chai';
import { getFilePath } from '../src/modules/upload.js';
import { PUBLIC_DIR } from '../initialize.js';
import upath from 'upath';

describe('File Path Test', ()=>{
    it('should return paths correctly', ()=>{
        expect(getFilePath("https://localhost:3000/source/images/abcd")).to.equal( upath.join(PUBLIC_DIR, 'images/abcd'));
    })
})