import { supabase } from '../supabaseClient.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLUMNS = [
    { key: 'building',       label: 'Building' },
    { key: 'room_number',    label: 'Room' },
    { key: 'total_bookings', label: 'Total bookings' },
    { key: 'checked_in',     label: 'Checked in' },
    { key: 'cancelled',      label: 'Cancelled' },
    { key: 'no_shows',       label: 'No-shows' }
];

export class ReportGenerator{
    #reportType     // String
    #dateRange      // 

    constructor(reportType = 'Booking summary', dateRange = { from: '', to: '' }){
        this.#reportType = reportType;
        this.#dateRange = dateRange;
    }

    get getReportType() {return this.#reportType;}
    get getDateRange() {return this.#dateRange;}

    async generate(){
        const { from, to } = this.#dateRange;
        if (!from || !to) throw new Error('Please choose a start and end date.');
        if (from > to) throw new Error('The start date must be before the end date.');

        const { data, error } = await supabase.rpc('booking_report', { p_from: from, p_to: to });
        if (error) throw new Error(error.message);
        return data || [];
    }

    exportCSV(rows){
        const quote = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const lines = [
            COLUMNS.map((c) => quote(c.label)).join(','),
            ...rows.map((r) => COLUMNS.map((c) => quote(r[c.key])).join(','))
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        this.#download(blob, `booking-report_${this.#dateRange.from}_to_${this.#dateRange.to}.csv`);
        return blob;
    }
    exportPDF(rows){
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`UniSpace: ${this.#reportType}`, 14, 16);
        doc.setFontSize(10);
        doc.text(`Period: ${this.#dateRange.from} to ${this.#dateRange.to}`, 14, 23);

        autoTable(doc, {
            startY: 28,
            head: [COLUMNS.map((c) => c.label)],
            body: rows.map((r) => COLUMNS.map((c) => r[c.key]))
        });

        doc.save(`booking-report_${this.#dateRange.from}_to_${this.#dateRange.to}.pdf`);
    }

    #download(blob, filename){
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}