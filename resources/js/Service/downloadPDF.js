import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { base64Font } from './IBMPlexSansArabic-Regular-normal.js';
import 'jspdf-autotable';

export function downloadPDF(data, isTable=true) {
    if (isTable) {
        const doc = new jsPDF('l', 'pt', 'a4');
        const myFont = base64Font;
        doc.addFileToVFS("MyFont.ttf", myFont);
        doc.addFont("MyFont.ttf", "MyFont", "normal");
        doc.setFont("MyFont");

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
            RowIndex: index + 1
        }));

        const columns = [
            {header: 'رابط وثائق المشروع', dataKey: 'ProjectLinks'},
            {header: 'تاريخ اعتماد اللجنة الرئيسية للمشروع بعد استيفاء جميع الملاحظات', dataKey: 'ApprovalDate'},
            {
                header: 'تاريخ مراجعة اللجنة الرئيسية للمشروع بعد استيفاء المالك للملاحظات ومراجعة اللجنة الفنية',
                dataKey: 'CoordReviewDate'
            },
            {header: 'تاريخ تسليم المالك للملاحظات لوحدة التنسيق بعد استيفاؤها', dataKey: 'OwnerNotesDate'},
            {
                header: 'تاريخ انتهاء اللجنة الفنية من مراجعة المشروع وتسليم الملاحظات الأولية لوحدة التنسيق الفني',
                dataKey: 'InitialReviewDate'
            },
            {header: 'تاريخ تسديد المطالبة المالية', dataKey: 'PaymentDate'},
            {header: 'تمام تسديد المطالبة المالية (نعم / لا)', dataKey: 'FinancialStatus'},
            {header: 'تاريخ استلام واستيفاء مستندات المشروع', dataKey: 'DocumentsDate'},
            {header: 'اسم الاستشاري', dataKey: 'Consultant'},
            {header: 'كود المشروع', dataKey: 'Code'},
            {header: 'الموقع', dataKey: 'Location'},
            {header: 'اسم المشروع', dataKey: 'Name'},
            {header: 'م', dataKey: 'RowIndex'}

        ];

        doc.autoTable({
            head: [columns.map(col => col.header)],
            body: tableData.map(item => columns.map(col => item[col.dataKey])),
            styles: {
                font: "MyFont",
                cellPadding: 2,
                overflow: 'linebreak',
                minCellHeight: 10,
                halign: 'right',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [255, 165, 0],
                textColor: [255, 255, 255],
                halign: 'right',
            },
            theme: 'grid',
            margin: {top: 20, right: 20, bottom: 20, left: 20},

            columnStyles: {
                11: {cellWidth: 20, halign: 'right'},
                0: {cellWidth: 'auto'},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'},
                5: {cellWidth: 'auto'},
                6: {cellWidth: 'auto'},
                7: {cellWidth: 'auto'},
                8: {cellWidth: 'auto'},
                9: {cellWidth: 'auto'},
                10: {cellWidth: '5'},
            },
            didParseCell: function (data) {
                if (data.column.index !== -1) {
                    data.cell.styles.cellWidth = (doc.internal.pageSize.getWidth() - 40) / columns.length; // Calculate width dynamically
                }
            }
        });

        // Save the PDF
        doc.save('المشاريع.pdf');
    } else {

        const project = data;
        const element = document.createElement('div');

        element.style.padding = '20px';
        element.style.fontSize = '20px';
        element.style.fontFamily = 'IBM Plex Sans Arabic, sans-serif';
        element.style.direction = 'rtl'; // Set text direction to right-to-left for Arabic content
        element.innerHTML = `
        <div style="padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h1 style="text-align: center; margin-bottom: 20px;">بيانات مشروع ${project.name}</h1>
            <div style="margin-bottom: 8px;"><strong>اسم المشروع:</strong> ${project.name}</div>
            <div style="margin-bottom: 8px;"><strong>الموقع:</strong> ${project.location}</div>
            <div style="margin-bottom: 8px;"><strong>كود المشروع:</strong> ${project.code}</div>
            <div style="margin-bottom: 8px;"><strong>اسم الاستشاري:</strong> ${project.consultant_name}</div>
            <div style="margin-bottom: 8px;"><strong>تاريخ استلام واستيفاء مستندات المشروع:</strong> ${project.documents_delivery_fulfillment_date}</div>
            <div style="margin-bottom: 8px;"><strong>تمام تسديد المطالبة المالية:</strong> ${project.financial_status ? 'تم الدفع' : 'لم يتم الدفع'}</div>
            <div style="margin-bottom: 8px;"><strong>تاريخ تسديد المطالبة المالية:</strong> ${project.finances_payment_date}</div>
            <div style="margin-bottom: 8px;"><strong>تاريخ انتهاء اللجنة الفنية من مراجعة المشروع وتسليم الملاحظات الأولية لوحدة التنسيق الفني:</strong> ${project.initial_review_notes_delivery_to_coord_unit_date}</div>
            <div style="margin-bottom: 8px;"><strong>تاريخ تسليم المالك للملاحظات لوحدة التنسيق بعد استيفاؤها:</strong> ${project.owner_notes_delivery_after_fulfillment_date}</div>
            <div style="margin-bottom: 8px;"><strong>تاريخ مراجعة اللجنة الرئيسية للمشروع بعد استيفاء المالك للملاحظات ومراجعة اللجنة الفنية:</strong> ${project.coord_unit_review_date}</div>
            <div style="margin-bottom: 8px;"><strong>تاريخ اعتماد اللجنة الرئيسية للمشروع بعد استيفاء جميع الملاحظات:</strong> ${project.unit_project_approval_date}</div>
            <div style="margin-bottom: 8px;"><strong>رابط وثائق المشروع:</strong> <a href="${project.project_material_links}" target="_blank">${project.project_material_links}</a></div>
            <div style="margin-bottom: 8px;"><strong>ملاحظات الحماية المدنية:</strong> ${project.civil_defense_notes}</div>
            <div style="margin-bottom: 8px;"><strong>ملاحظات المعماري:</strong> ${project.architectural_notes}</div>
            <div style="margin-bottom: 8px;"><strong>ملاحظات الالكتروميكانيك:</strong> ${project.electromechanical_notes}</div>
        </div>
    `;

        // Configure html2pdf options to ensure margins and text preservation
        const options = {
            filename: `${project.name}-project-details.pdf`,
            margin: [10, 10, 10, 10], // Set margins [top, right, bottom, left]
            pagebreak: { mode: 'avoid-all' }, // Avoid breaking pages in unwanted places
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Increase scale to improve text quality
                useCORS: true, // Enable cross-origin to avoid CORS issues
                logging: true
            },
            jsPDF: {
                unit: 'pt', // Points as unit for better text rendering
                format: 'a4', // Use A4 format for the document
                orientation: 'portrait'
            }
        };

        // Generate PDF from the dynamically created element, without rendering text as image
        html2pdf().from(element).set(options).toPdf().get('pdf').then(function (pdf) {
            // Preserve text as text instead of rendering it as an image
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(12); // Set font size to improve readability
            }
        }).save();
    }
}
