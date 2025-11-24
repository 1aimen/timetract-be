// reports.templates.ts

export type ReportType =
  | "USER_ATTENDANCE_SUMMARY"
  | "USER_PAYROLL_SUMMARY"
  | "ADMIN_EMPLOYEE_OVERVIEW"
  | "ADMIN_PROJECT_OVERVIEW";

export type TableColumn = {
  header: string;
  key: string;
  width?: number;
  align?: "left" | "center" | "right";
};

export type TableData = {
  columns: TableColumn[];
  rows: Record<string, any>[];
};

export type ReportTemplate = {
  title: string;
  description: string;
  branding?: {
    companyName: string;
    logoPath?: string;
    primaryColor?: string;
  };
  generate: (data?: Record<string, any>) => {
    header: string;
    body?: string;
    footer?: string;
    table?: TableData;
  };
};

export const reportTemplates: Record<ReportType, ReportTemplate> = {
  USER_ATTENDANCE_SUMMARY: {
    title: "Attendance Summary",
    description: "Shows user clock-ins, clock-outs, and absences.",
    branding: {
      companyName: "Tyrex Cyber",
      logoPath: "./assets/logo.png",
      primaryColor: "#009688",
    },
    generate: (data) => ({
      header: `Attendance Summary for ${data?.userName} - ${data?.period}`,
      body: `Attendance Rate: ${data?.attendanceRate}%`,
      table: {
        columns: [
          { header: "Date", key: "date", width: 100 },
          { header: "Clock In", key: "clockIn", width: 80 },
          { header: "Clock Out", key: "clockOut", width: 80 },
          { header: "Status", key: "status", width: 100 },
        ],
        rows: data?.records || [],
      },
      footer: "Generated automatically by Tyrex Cyber System",
    }),
  },

  USER_PAYROLL_SUMMARY: {
    title: "Payroll Summary",
    description: "Displays worked hours and earnings for a given period.",
    branding: {
      companyName: "Tyrex Cyber",
      primaryColor: "#00796B",
    },
    generate: (data) => ({
      header: `Payroll Report - ${data?.userName} (${data?.period})`,
      body: `
        Total Hours Worked: ${data?.hoursWorked}
        Hourly Rate: ${data?.hourlyRate}€
        Total Earnings: ${data?.totalEarnings}€
      `,
      table: {
        columns: [
          { header: "Date", key: "date" },
          { header: "Hours Worked", key: "hours" },
          { header: "Earnings (€)", key: "earnings" },
        ],
        rows: data?.entries || [],
      },
    }),
  },

  ADMIN_EMPLOYEE_OVERVIEW: {
    title: "Employee Overview",
    description: "Summary of all employees and their performance.",
    branding: {
      companyName: "Tyrex Cyber",
      logoPath: "./assets/logo.png",
      primaryColor: "#004D40",
    },
    generate: (data) => ({
      header: `Employee Overview - ${data?.organizationName}`,
      table: {
        columns: [
          { header: "Name", key: "name" },
          { header: "Role", key: "role" },
          { header: "Status", key: "status" },
          { header: "Performance", key: "performance" },
        ],
        rows: data?.employees || [],
      },
    }),
  },

  ADMIN_PROJECT_OVERVIEW: {
    title: "Project Overview",
    description: "Summary of all projects and their statuses.",
    branding: {
      companyName: "Tyrex Cyber",
      primaryColor: "#00695C",
    },
    generate: (data) => ({
      header: `Project Overview - ${data?.period}`,
      table: {
        columns: [
          { header: "Project", key: "name" },
          { header: "Status", key: "status" },
          { header: "Progress (%)", key: "progress" },
          { header: "Manager", key: "manager" },
        ],
        rows: data?.projects || [],
      },
    }),
  },
};
