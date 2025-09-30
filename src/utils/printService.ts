export const printBadge = () => {
  const printWindow = window;
  
  // Trigger print dialog
  printWindow.print();
};

export const printMultipleBadges = (count: number) => {
  // For batch printing, you would create multiple badge instances
  // and print them all at once
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      printBadge();
    }, i * 1000); // Delay between prints
  }
};
