import {expect} from 'chai';
import { getFilePath } from '../src/modules/upload';
import { PUBLIC_DIR } from '../src/server';
import upath from 'upath';

describe('File Path Test', ()=>{
    it('should return paths correctly', ()=>{
        expect(getFilePath("https://localhost:3000/source/images/abcd")).to.equal( upath.join(PUBLIC_DIR, 'images/abcd'));
    })
})