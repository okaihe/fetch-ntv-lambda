import helper from "../src/helper.mjs";
import fs from "fs";
import { expect } from "chai";

describe("cleanHTMLContent", () => {
    it("Should clean nav, script, link and style tags.", () => {
        let dirtyContent = fs.readFileSync("./test/test-input.html").toString();
        let expectedResult = fs.readFileSync("./test/test-output.html").toString();

        let cleandHTML = helper.cleanHTMLContent(dirtyContent);

        expect(cleandHTML).to.equal(expectedResult);
    });
});
