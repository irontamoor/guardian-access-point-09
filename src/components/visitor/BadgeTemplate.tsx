import { useSystemSettings } from '@/hooks/useSystemSettings';

interface BadgeTemplateProps {
  visitorData: {
    first_name: string;
    last_name: string;
    visit_purpose: string;
    host_name: string;
    organization?: string;
    check_in_time: string;
  };
}

export function BadgeTemplate({ visitorData }: BadgeTemplateProps) {
  const { settings } = useSystemSettings();

  return (
    <div className="badge-container" id="visitor-badge">
      <div className="badge-content">
        {/* Header */}
        <div className="badge-header">
          <h1 className="school-name">{settings.school_name}</h1>
          <h2 className="badge-title">VISITOR BADGE</h2>
        </div>

        {/* Visitor Name */}
        <div className="badge-section name-section">
          <div className="field-label">VISITOR NAME</div>
          <div className="field-value name-value">
            {visitorData.first_name} {visitorData.last_name}
          </div>
        </div>

        {/* Organization */}
        {visitorData.organization && (
          <div className="badge-section">
            <div className="field-label">ORGANIZATION</div>
            <div className="field-value">{visitorData.organization}</div>
          </div>
        )}

        {/* Purpose of Visit */}
        <div className="badge-section">
          <div className="field-label">PURPOSE OF VISIT</div>
          <div className="field-value">{visitorData.visit_purpose}</div>
        </div>

        {/* Host/Contact Person */}
        <div className="badge-section">
          <div className="field-label">HOST/CONTACT PERSON</div>
          <div className="field-value">{visitorData.host_name}</div>
        </div>

        {/* Date & Time */}
        <div className="badge-section">
          <div className="field-label">DATE & TIME</div>
          <div className="field-value">
            {new Date(visitorData.check_in_time).toLocaleString()}
          </div>
        </div>

        {/* Footer */}
        <div className="badge-footer">
          <p>Please wear this badge at all times</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          #visitor-badge,
          #visitor-badge * {
            visibility: visible;
          }
          
          #visitor-badge {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }

        .badge-container {
          width: 4in;
          height: 6in;
          margin: 0 auto;
          background: white;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 20px;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        .badge-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .badge-header {
          text-align: center;
          border-bottom: 3px solid #9333ea;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .school-name {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0 0 8px 0;
        }

        .badge-title {
          font-size: 18px;
          font-weight: 600;
          color: #9333ea;
          margin: 0;
        }

        .badge-section {
          margin-bottom: 16px;
        }

        .name-section {
          border: 2px solid #9333ea;
          padding: 12px;
          border-radius: 6px;
          background: #faf5ff;
        }

        .field-label {
          font-size: 10px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .field-value {
          font-size: 16px;
          font-weight: 500;
          color: #111;
          word-wrap: break-word;
        }

        .name-value {
          font-size: 22px;
          font-weight: 700;
          color: #9333ea;
        }

        .badge-footer {
          margin-top: auto;
          text-align: center;
          padding-top: 12px;
          border-top: 1px solid #ddd;
        }

        .badge-footer p {
          font-size: 11px;
          color: #666;
          margin: 0;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
