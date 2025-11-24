import { generatePDFReport } from "../../utils/pdf.utils";
import { reportTemplates } from "../../utils/templates/reports/reports.templates";

export class ReportsService {
  async generateAttendanceReport(userId: string, period: string) {
    const data = {
      userName: "Aimen",
      period,
      attendanceRate: 95,
      records: [
        {
          date: "2025-10-01",
          clockIn: "09:00",
          clockOut: "17:00",
          status: "Present",
        },
        {
          date: "2025-10-02",
          clockIn: "09:15",
          clockOut: "17:05",
          status: "Present",
        },
        { date: "2025-10-03", clockIn: "-", clockOut: "-", status: "Absent" },
      ],
    };

    const templateDef = reportTemplates.USER_ATTENDANCE_SUMMARY;
    const report = templateDef.generate(data);

    generatePDFReport(
      report,
      templateDef.branding,
      `./reports/attendance-${userId}.pdf`
    );
  }
}
