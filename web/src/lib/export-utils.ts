import * as XLSX from 'xlsx';

/**
 * An array of objects to a worksheet and triggers a download.
 * @param data The array of data to export.
 * @param filename The desired name for the downloaded file.
 */
export const exportToExcel = <T extends Record<string, any>[]>(data: T, filename: string) => {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${filename}.xlsx`);
}; 