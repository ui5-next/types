import { cutByIndexArray, secureSplit } from "../utils";


describe('Utils Test Suite', () => {

  it('should cut string by array', () => {

    expect(cutByIndexArray("012345", [1, 3])).toStrictEqual(["0", "2", "45"]);

    expect(cutByIndexArray("012345", [])).toStrictEqual(["012345"]);


  });

  it('should secure cuts string', () => {

    expect(secureSplit("Promise|Promise<A|B>", "|")).toStrictEqual(["Promise", "Promise<A|B>"]);
    expect(secureSplit("Promise|Promise<A|Map<string,string|number>>", "|")).toStrictEqual(["Promise", "Promise<A|Map<string,string|number>>"]);
    expect(secureSplit("Promise", "|")).toStrictEqual(["Promise"]);


  });

});