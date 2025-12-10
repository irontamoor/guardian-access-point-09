export const printBadge = () => {
  const badgeElement = document.getElementById('visitor-badge');
  if (!badgeElement) {
    console.error('Badge element not found');
    return;
  }

  // Create a new print window with only the badge content
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) {
    console.error('Could not open print window');
    // Fallback to regular print
    window.print();
    return;
  }

  // Get the badge HTML and styles
  const badgeHTML = badgeElement.outerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Visitor Badge</title>
      <style>
        @page {
          size: 4in 6in;
          margin: 0;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 4in;
          height: 6in;
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        
        .badge-container {
          width: 4in;
          height: 6in;
          margin: 0;
          background: white;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 20px;
          box-sizing: border-box;
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
        
        @media print {
          html, body {
            width: 4in !important;
            height: 6in !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .badge-container {
            border: 2px solid #333 !important;
          }
          
          .badge-header {
            border-bottom: 3px solid #9333ea !important;
          }
          
          .name-section {
            border: 2px solid #9333ea !important;
            background: #faf5ff !important;
          }
          
          .name-value {
            color: #9333ea !important;
          }
          
          .badge-title {
            color: #9333ea !important;
          }
        }
      </style>
    </head>
    <body>
      ${badgeHTML}
    </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  // Fallback if onload doesn't fire
  setTimeout(() => {
    if (!printWindow.closed) {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }, 500);
};

export const printMultipleBadges = (count: number) => {
  // For batch printing, print one badge at a time with delays
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      printBadge();
    }, i * 2000); // 2 second delay between prints
  }
};
