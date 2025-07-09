import { readDataFromFile, writeDataToFile } from '../utils/reports.js';


export async function extractAndProcessDataStatement2() {
    const fileData = await readDataFromFile('files/Income_Statement_Company_2.json');
    const jsonData = fileData.data;
    const records = flattenPeriods(jsonData);
    await writeDataToFile('files/output/company_2.json', records);
}


function flattenPeriods(payload) {
    const SECTION_MAP = {
        revenue: 'REVENUE',
        cost_of_goods_sold: 'COGS',
        operating_expenses: 'OPERATING_EXPENSES',
        non_operating_revenue: 'NON_OPERATING_REVENUE',
        non_operating_expenses: 'NON_OPERATING_EXPENSES',
    };

    const out = [];

    payload.forEach(period => {
        const startDate = new Date(period.period_start + "T00:00:00.000Z").toISOString();
        const endDate = new Date(period.period_end + "T00:00:00.000Z").toISOString();
        const source = "source_2";

        Object.keys(SECTION_MAP).forEach(sectionKey => {
            const groupName = SECTION_MAP[sectionKey];
            const section = period[sectionKey] || [];

            section.forEach(block => {
                (block.line_items || []).forEach(item => {
                    if (item.value != '') {

                        out.push({
                            type: item.name,
                            group: groupName,
                            value: Number(item.value).toFixed(2),
                            startDate,
                            endDate,
                            source
                        });
                    }
                });
            });
        });
    });

    return out;
}


