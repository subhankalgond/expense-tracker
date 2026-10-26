import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatINR } from './currency';
import { formatDisplayDate } from './date';
/**
 * Sanitizes cell values to prevent CSV formula injection (CSV Injection / CWE-1236).
 * Escapes quotes and wraps strings with commas or quotes according to RFC 4180.
 */
export function sanitizeCsvField(val) {
    if (val === null || val === undefined)
        return '""';
    let str = String(val);
    // Formula injection mitigation: prepend single quote if starting with =, +, -, @, or tab/return
    if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
    }
    // RFC 4180: If field contains double quotes, commas, or newlines, escape quotes by doubling them
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        str = `"${str.replace(/"/g, '""')}"`;
    }
    else {
        str = `"${str}"`;
    }
    return str;
}
/**
 * Generates and triggers download of CSV from transactions list
 */
export function exportTransactionsToCSV(transactions, filenamePrefix = 'ledger_transactions') {
    if (!transactions || transactions.length === 0) {
        throw new Error('No transactions available to export');
    }
    const headers = [
        'Date',
        'Type',
        'Amount (INR)',
        'Category',
        'Payment Method',
        'Description',
        'Notes',
    ];
    const rows = transactions.map((t) => [
        sanitizeCsvField(t.date),
        sanitizeCsvField(t.type.toUpperCase()),
        sanitizeCsvField(t.amount.toFixed(2)),
        sanitizeCsvField(t.category?.name || 'Uncategorized'),
        sanitizeCsvField(t.payment_method?.name || 'Standard'),
        sanitizeCsvField(t.description),
        sanitizeCsvField(t.notes || ''),
    ]);
    const csvContent = '\uFEFF' + // UTF-8 BOM
        headers.map((h) => sanitizeCsvField(h)).join(',') +
        '\r\n' +
        rows.map((r) => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
/**
 * Generates an editorial Neo-Brutalist PDF financial report using jsPDF and jspdf-autotable
 */
export function exportReportToPDF(options) {
    const { title, periodLabel, totalIncome, totalExpense, netCashFlow, categorySpending, transactions } = options;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    // Neo-Brutalist Editorial Header
    doc.setFillColor(244, 241, 234); // warm cream
    doc.rect(0, 0, pageWidth, 42, 'F');
    doc.setDrawColor(18, 18, 20); // deep ink border
    doc.setLineWidth(0.8);
    doc.line(14, 42, pageWidth - 14, 42);
    doc.setFont('courier', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(18, 18, 20);
    doc.text('LEDGER BRUTALIST', 14, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 64, 175); // cobalt
    doc.text(title.toUpperCase(), 14, 26);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(82, 84, 93);
    doc.text(`REPORT PERIOD: ${periodLabel.toUpperCase()} | GENERATED: ${new Date().toLocaleDateString('en-IN')}`, 14, 33);
    // Financial Metrics Summary Box
    const summaryY = 50;
    const colWidth = (pageWidth - 28) / 3;
    // Box 1: Total Income
    doc.setFillColor(236, 253, 245);
    doc.rect(14, summaryY, colWidth - 2, 22, 'F');
    doc.rect(14, summaryY, colWidth - 2, 22, 'S');
    doc.setFontSize(8);
    doc.setTextColor(4, 120, 87);
    doc.text('TOTAL INCOME', 18, summaryY + 6);
    doc.setFontSize(13);
    doc.setFont('courier', 'bold');
    doc.text(formatINR(totalIncome), 18, summaryY + 16);
    // Box 2: Total Expense
    doc.setFillColor(254, 242, 242);
    doc.rect(14 + colWidth, summaryY, colWidth - 2, 22, 'F');
    doc.rect(14 + colWidth, summaryY, colWidth - 2, 22, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(185, 28, 28);
    doc.text('TOTAL EXPENSES', 18 + colWidth, summaryY + 6);
    doc.setFontSize(13);
    doc.setFont('courier', 'bold');
    doc.text(formatINR(totalExpense), 18 + colWidth, summaryY + 16);
    // Box 3: Net Cash Flow
    const netBgColor = netCashFlow >= 0 ? [240, 249, 255] : [255, 241, 242];
    doc.setFillColor(netBgColor[0], netBgColor[1], netBgColor[2]);
    doc.rect(14 + colWidth * 2, summaryY, colWidth - 2, 22, 'F');
    doc.rect(14 + colWidth * 2, summaryY, colWidth - 2, 22, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(netCashFlow >= 0 ? 30 : 185, netCashFlow >= 0 ? 64 : 28, netCashFlow >= 0 ? 175 : 28);
    doc.text('NET CASH FLOW', 18 + colWidth * 2, summaryY + 6);
    doc.setFontSize(13);
    doc.setFont('courier', 'bold');
    doc.text(formatINR(netCashFlow), 18 + colWidth * 2, summaryY + 16);
    // Category Breakdown Section
    let currentY = 80;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(18, 18, 20);
    doc.text('CATEGORY EXPENDITURE BREAKDOWN', 14, currentY);
    const categoryRows = categorySpending.slice(0, 8).map((c) => [
        c.category,
        formatINR(c.amount),
        `${c.percentage}%`,
    ]);
    autoTable(doc, {
        startY: currentY + 4,
        head: [['Category', 'Amount', 'Share of Total']],
        body: categoryRows.length > 0 ? categoryRows : [['No expense data in this period', '-', '-']],
        theme: 'plain',
        headStyles: {
            fillColor: [244, 239, 230],
            textColor: [18, 18, 20],
            fontStyle: 'bold',
            lineColor: [18, 18, 20],
            lineWidth: 0.3,
        },
        bodyStyles: {
            textColor: [18, 18, 20],
            lineColor: [220, 220, 220],
            lineWidth: 0.1,
        },
        margin: { left: 14, right: 14 },
    });
    // Transaction Ledger Table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastTableInfo = doc.lastAutoTable;
    const tableEndY = lastTableInfo ? lastTableInfo.finalY + 10 : 130;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(18, 18, 20);
    doc.text('TRANSACTION LOG (CHRONOLOGICAL)', 14, tableEndY);
    const txRows = transactions.slice(0, 40).map((t) => [
        formatDisplayDate(t.date),
        t.type.toUpperCase(),
        t.description,
        t.category?.name || 'General',
        t.payment_method?.name || 'UPI',
        (t.type === 'income' ? '+ ' : '- ') + formatINR(t.amount),
    ]);
    autoTable(doc, {
        startY: tableEndY + 4,
        head: [['Date', 'Type', 'Description', 'Category', 'Method', 'Amount']],
        body: txRows.length > 0 ? txRows : [['No transactions found', '-', '-', '-', '-', '-']],
        theme: 'plain',
        headStyles: {
            fillColor: [18, 18, 20],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        bodyStyles: {
            textColor: [18, 18, 20],
            lineColor: [220, 220, 220],
            lineWidth: 0.1,
        },
        columnStyles: {
            5: { halign: 'right', fontStyle: 'bold' },
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
            // Footer with page numbering
            doc.setFont('courier', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.text(`PAGE ${data.pageNumber} | CONFIDENTIAL FINANCIAL LEDGER`, pageWidth / 2, pageHeight - 8, { align: 'center' });
        },
    });
    doc.save(`ledger_report_${periodLabel.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
