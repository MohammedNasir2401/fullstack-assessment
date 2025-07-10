import { readDataFromFile, writeDataToFile, mapGroupToCategory } from '../utils/reports.js';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

export async function extractAndProcessDataStatement1() {

    const fileData = await readDataFromFile('src/files/Income_Statement_Company_1.json');
    const jsonData = fileData.data;

    const datePeriods = extractDatePeriods(jsonData);
    const topRows = normalizeArray(jsonData.Rows?.Row || []);
    const records = extractRecords(topRows, datePeriods);

    await writeDataToFile('src/files/output/company_1.json', records);
    console.log(JSON.stringify(records, null, 2));
}

function extractDatePeriods(data) {
    const datePeriods = [];

    const columns = data.Columns?.Column || [];

    for (let i = 1; i < columns.length - 1; i++) {
        const meta = columns[i].MetaData || [];
        const startDate = new Date(meta[0]?.Value);
        const endDate = new Date(meta[1]?.Value);
        datePeriods.push({ start: startDate, end: endDate });
    }

    return datePeriods;
}

function extractRecords(rows, datePeriods, parentGroup = null, collected = []) {
    for (const row of rows) {
        if (row.type === 'Section' && row.Rows?.Row) {
            const children = normalizeArray(row.Rows.Row);
            extractRecords(children, datePeriods, row.group || parentGroup, collected);
        }

        else if (row.ColData) {
            const itemType = row.ColData[0]?.value;
            const cells = row.ColData.slice(1, datePeriods.length + 1);

            cells.forEach((cell, index) => {
                if (cell.value !== '') {
                    if (cell.value !== '' && cell.value !== '0.00') {

                        collected.push({
                            type: itemType,
                            group: mapGroupToCategory(parentGroup),
                            value: cell.value,
                            startDate: datePeriods[index].start,
                            endDate: datePeriods[index].end,
                            source: 'source_1'
                        });
                    }
                }
            });

            if (row.Rows?.Row) {
                const children = normalizeArray(row.Rows.Row);
                extractRecords(children, datePeriods, parentGroup, collected);
            }
        }

        else if (row.Header && row.Rows?.Row) {
            const children = normalizeArray(row.Rows.Row);
            extractRecords(children, datePeriods, parentGroup, collected);
        }
    }

    return collected;
}

function normalizeArray(rowOrArray) {
    return Array.isArray(rowOrArray) ? rowOrArray : [rowOrArray];
}


