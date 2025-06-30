import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@school.com';
    
    // Configure transporter based on available environment variables
    if (process.env.SENDGRID_API_KEY) {
      // SendGrid configuration
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      // SMTP configuration
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      };
      
      this.transporter = nodemailer.createTransport(config);
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      console.log('Email sent successfully to:', options.to);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  // Student check-in notification
  async sendStudentCheckInNotification(studentName: string, parentEmail: string, checkInTime: string): Promise<void> {
    const subject = `${studentName} has checked in`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Student Check-In Notification</h2>
        <p>Dear Parent/Guardian,</p>
        <p><strong>${studentName}</strong> has successfully checked in at <strong>${checkInTime}</strong>.</p>
        <p>This is an automated notification from ${process.env.SCHOOL_NAME || 'School'} Visitor Management System.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          If you have any questions, please contact the school office.
        </p>
      </div>
    `;
    
    await this.sendEmail({
      to: parentEmail,
      subject,
      html,
    });
  }

  // Staff attendance alert
  async sendStaffAttendanceAlert(staffName: string, adminEmail: string, status: string, time: string): Promise<void> {
    const subject = `Staff Attendance Alert - ${staffName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Staff Attendance Alert</h2>
        <p>Dear Administrator,</p>
        <p><strong>${staffName}</strong> has marked attendance as <strong>${status}</strong> at <strong>${time}</strong>.</p>
        <p>Please review if this requires any action.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Automated alert from ${process.env.SCHOOL_NAME || 'School'} Visitor Management System.
        </p>
      </div>
    `;
    
    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  // Visitor registration notification
  async sendVisitorNotification(visitorName: string, hostName: string, hostEmail: string, visitTime: string): Promise<void> {
    const subject = `Visitor Registration - ${visitorName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Visitor Registration</h2>
        <p>Dear ${hostName},</p>
        <p>You have a visitor: <strong>${visitorName}</strong></p>
        <p>Registration time: <strong>${visitTime}</strong></p>
        <p>Please proceed to the reception to meet your visitor.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Automated notification from ${process.env.SCHOOL_NAME || 'School'} Visitor Management System.
        </p>
      </div>
    `;
    
    await this.sendEmail({
      to: hostEmail,
      subject,
      html,
    });
  }

  // Daily attendance report
  async sendDailyReport(adminEmail: string, reportData: any): Promise<void> {
    const subject = `Daily Attendance Report - ${new Date().toLocaleDateString()}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">Daily Attendance Report</h2>
        <p>Date: <strong>${new Date().toLocaleDateString()}</strong></p>
        
        <h3>Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Students Present</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${reportData.studentsPresent || 0}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Staff Present</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${reportData.staffPresent || 0}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Visitors</strong></td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${reportData.visitors || 0}</td>
          </tr>
        </table>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Automated report from ${process.env.SCHOOL_NAME || 'School'} Visitor Management System.
        </p>
      </div>
    `;
    
    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  }

  // Test email connectivity
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
