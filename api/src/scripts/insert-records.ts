import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { readDataFromFile } from '../utils/reports.js';


export async function loadDataAndInsertInDB() {
    console.log('Loading data...');
    const company = await prisma.company.create({
        data: {
            name: 'Company 1',
        }
    });
    const files = ['company_1.json', 'company_2.json'];
    for (const file of files) {
        const records = await readDataFromFile(`src/files/output/${file}`);
        console.log(records)
        return;
        for (const record of records) {
            await prisma.record.create({
                data: {
                    ...record,

                    companyId: company.id
                }
            });
        }
    }


}