import jsPDF from 'jspdf';
import { base64Font } from './IBMPlexSansArabic-Regular-normal.js';
import 'jspdf-autotable';

export function downloadPDF(data) {
    // Create a new instance of jsPDF with landscape orientation
    const doc = new jsPDF('l', 'pt', 'a4'); // Landscape orientation
    const myFont = base64Font;
    doc.addFileToVFS("MyFont.ttf", myFont);
    doc.addFont("MyFont.ttf", "MyFont", "normal");
    doc.setFont("MyFont");

    // Prepare the data for the table, ignoring the ID, CreatedAt, and UpdatedAt
    const tableData = data.map((item, index) => ({
        Name: item.name,
        Location: item.location,
        Code: item.code,
        Consultant: item.consultant_name || 'N/A',
        DocumentsDate: new Date(item.documents_delivery_fulfillment_date).toLocaleDateString(),
        FinancialStatus: item.financial_status ? 'مدفوع' : 'غير مدفوع',
        PaymentDate: item.finances_payment_date ? new Date(item.finances_payment_date).toLocaleDateString() : 'N/A',
        InitialReviewDate: item.initial_review_notes_delivery_to_coord_unit_date ? new Date(item.initial_review_notes_delivery_to_coord_unit_date).toLocaleDateString() : 'N/A',
        OwnerNotesDate: item.owner_notes_delivery_after_fulfillment_date ? new Date(item.owner_notes_delivery_after_fulfillment_date).toLocaleDateString() : 'N/A',
        CoordReviewDate: item.coord_unit_review_date ? new Date(item.coord_unit_review_date).toLocaleDateString() : 'N/A',
        ApprovalDate: item.unit_project_approval_date ? new Date(item.unit_project_approval_date).toLocaleDateString() : 'N/A',
        ProjectLinks: item.project_material_links ? item.project_material_links : 'N/A',
        RowIndex: index + 1 // Add row index starting from 1
    }));

    // Define the columns for the table in reverse order, including the new RowIndex column
    const columns = [
        { header: 'رابط وثائق المشروع', dataKey: 'ProjectLinks' },
        { header: 'تاريخ اعتماد اللجنة الرئيسية للمشروع بعد استيفاء جميع الملاحظات', dataKey: 'ApprovalDate' },
        { header: 'تاريخ مراجعة اللجنة الرئيسية للمشروع بعد استيفاء المالك للملاحظات ومراجعة اللجنة الفنية', dataKey: 'CoordReviewDate' },
        { header: 'تاريخ تسليم المالك للملاحظات لوحدة التنسيق بعد استيفاؤها', dataKey: 'OwnerNotesDate' },
        { header: 'تاريخ انتهاء اللجنة الفنية من مراجعة المشروع وتسليم الملاحظات الأولية لوحدة التنسيق الفني', dataKey: 'InitialReviewDate' },
        { header: 'تاريخ تسديد المطالبة المالية', dataKey: 'PaymentDate' },
        { header: 'تمام تسديد المطالبة المالية (نعم / لا)', dataKey: 'FinancialStatus' },
        { header: 'تاريخ استلام واستيفاء مستندات المشروع', dataKey: 'DocumentsDate' },
        { header: 'اسم الاستشاري', dataKey: 'Consultant' },
        { header: 'كود المشروع', dataKey: 'Code' },
        { header: 'الموقع', dataKey: 'Location' },
        { header: 'اسم المشروع', dataKey: 'Name' },
        { header: 'م', dataKey: 'RowIndex' } // New row index column

    ];

    // Use autoTable to add the table to the PDF
    doc.autoTable({
        head: [columns.map(col => col.header)],
        body: tableData.map(item => columns.map(col => item[col.dataKey])),
        styles: {
            font: "MyFont",
            cellPadding: 2,
            overflow: 'linebreak',
            minCellHeight: 10,
            halign: 'right', // Right-align text
            valign: 'middle' // Vertically center text
        },
        headStyles: {
            fillColor: [255, 165, 0], // Orange color in RGB
            textColor: [255, 255, 255], // White text
            halign: 'right', // Right-align header text
        },
        theme: 'grid',
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, // Set margins
        // Define column styles, making the index column narrower
        columnStyles: {
            11: { cellWidth: 20, halign: 'right' }, // Narrow width for RowIndex column
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 'auto' },
            4: { cellWidth: 'auto' },
            5: { cellWidth: 'auto' },
            6: { cellWidth: 'auto' },
            7: { cellWidth: 'auto' },
            8: { cellWidth: 'auto' },
            9: { cellWidth: 'auto' },
            10: { cellWidth: '5' },
        },
        // Override default styles to take the full width
        didParseCell: function (data) {
            if (data.column.index !== -1) {
                data.cell.styles.cellWidth = (doc.internal.pageSize.getWidth() - 40) / columns.length; // Calculate width dynamically
            }
        }
    });

    // Save the PDF
    doc.save('table.pdf');
}
