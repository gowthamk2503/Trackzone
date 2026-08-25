import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export Attendance Table to PDF
 */
export const exportAttendanceToPDF = (
  records,
  title = 'TrackZone Attendance Report',
  userName
) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(99, 102, 241); // Indigo color
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TRACKZONE ENTERPRISE ATTENDANCE', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 145, 15);

  // Subtitle
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 34);

  if (userName) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Employee: ${userName}`, 14, 40);
  }

  // Format table data
  const tableData = records.map((record, index) => {
    const checkInTime = record.checkIn?.time
      ? new Date(record.checkIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--';
    const checkOutTime = record.checkOut?.time
      ? new Date(record.checkOut.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--';
    const office = record.officeLocation?.officeName || 'HQ Office';

    return [
      index + 1,
      record.date,
      record.employeeId,
      checkInTime,
      checkOutTime,
      `${record.workingHours || 0} hrs`,
      record.status,
      office,
    ];
  });

  doc.autoTable({
    startY: userName ? 45 : 39,
    head: [['#', 'Date', 'Employee ID', 'Check In', 'Check Out', 'Hours', 'Status', 'Office Location']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `TrackZone Attendance Security Engine | Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

/**
 * Export Admin Performance Summary Report to PDF
 */
export const exportMonthlyReportPDF = (
  reports,
  month
) => {
  const doc = new jsPDF('landscape');

  // Header Banner
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TRACKZONE MONTHLY WORKFORCE ANALYTICS', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Billing Month: ${month} | Total Staff: ${reports.length}`, 210, 15);

  const tableData = reports.map((r, i) => [
    i + 1,
    r.employeeId,
    r.name,
    r.department,
    r.designation,
    r.presentDays,
    r.lateDays,
    r.halfDays,
    r.absentDays,
    r.leaveDays,
    `${r.totalHours} hrs`,
    `${r.averageHours} hrs`,
    `${r.attendanceRate}%`,
  ]);

  doc.autoTable({
    startY: 32,
    head: [
      [
        '#',
        'Emp ID',
        'Name',
        'Department',
        'Designation',
        'Present',
        'Late',
        'Half Day',
        'Absent',
        'Leaves',
        'Total Hrs',
        'Avg Hrs/Day',
        'Rate',
      ],
    ],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [67, 56, 202],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
    },
  });

  doc.save(`trackzone_monthly_report_${month}.pdf`);
};

/**
 * Export Data to Excel (.xlsx)
 */
export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Data');
  XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
};
