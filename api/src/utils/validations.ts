import { Prisma } from "@prisma/client";

export function getNumberParam(param: unknown, defaultValue: number): number {
    if (typeof param === 'string') {
        const num = parseInt(param, 10);
        return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
}

export function decimalToNumber(value?: Prisma.Decimal | null): number {
    return value ? Number(Number(value).toFixed(2)) : 0;
}

export function toTwoDecimalPlaces(value: number): number {
    return Number(Number(value).toFixed(2));
}
