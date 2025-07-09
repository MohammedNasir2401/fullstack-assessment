import { loadDataAndInsertInDB } from "./insert-records.js";
import { extractAndProcessDataStatement1 } from "./statement-1.js";
import { extractAndProcessDataStatement2 } from "./statement-2.js";

(async function () {
    try {
        await extractAndProcessDataStatement1();
        await extractAndProcessDataStatement2();
        await loadDataAndInsertInDB();
        console.log("All Scripts Executed Successfully");
    } catch (err) {
        console.error("Something went wrong:", err);
    }
})();