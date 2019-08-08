
import { buildTypeDefinitions } from '../builder';
import * as path from "path";
import { readFileSync } from 'fs';

describe('builder test suite', () => {

  test('should generate types', () => {
    const apiRefString = readFileSync(path.join(__dirname, "../../resources/sample-apiref.json"), { encoding: "UTF-8" });
    const apiRef = JSON.parse(apiRefString)
    // do no thing
    // buildTypeDefinitions(apiRef)

  });

});