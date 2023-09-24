import * as XLSX from "xlsx/xlsx.mjs";

const example = {
    columns: [
        {
            id: "id",
            label: "#",
        },
        {
            id: "option",
            label: "Phương án",
        },
        {
            id: "submitedBy",
            label: "Người chọn",
        },
        {
            id: "submitedAt",
            label: "Thời điểm chọn",
        },
        //Tiêu đề của cột
    ],
    sheetName: "SlideResult", //tên của sheet
    fileName: "PresentationResult", //tên của file
    data: [
        {
            id: "1",
            option: "Lựa chọn 1",
            submitedBy: "Khoa",
            submitedAt: new Date(),
        },
        {
            id: "3",
            option: "Lựa chọn 3",
            submitedBy: "Khoa",
            submitedAt: new Date(),
        },
        {
            id: "3",
            option: "Lựa chọn 3",
            submitedBy: "Khoa",
            submitedAt: new Date(),
        },
        //data là một mảng các object mà trong mỗi object sẽ có các field tương ứng với từng id bên trong columns
    ],
};
/**
 * use above example:
 * exportExcel({
 *      data: example.data,
 *      sheetName: example.sheetName,
 *      fileName: example.fileName,
 *      columns: example.columns
 * })
 */
export const exportExcel = ({ data, sheetName, fileName, columns }) => {
    return new Promise((resolve, reject) => {
        let newData = [];
        data.forEach((item) => {
            let itemData = {};
            columns.forEach((item2) => {
                itemData[item2.label] = item[item2.id];
            });
            newData.push(itemData);
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(newData, {
            cellDates: true,
            dateNF: "DD/MM/YYYY HH:mm",
        });
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
        resolve("Export Excel Successfully!");
    });
};

export const removeSheetNameInvalidCharacter = (name) => {
    return (
        "Slide " +
        (name + "" || "")
            .replaceAll("\\", "")
            .replaceAll("/", "")
            .replaceAll("?", "")
            .replaceAll("*", "")
            .replaceAll("[", "")
            .replaceAll("]", "")
            .replaceAll(" ", "_")
    );
};
