// Format para sa pera (may comma at 2 decimal places)
export const formatCurrency = (amount) => {
  return `₱${Number(amount).toLocaleString('en-PH', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

// Format para sa number lang (may comma, walang decimal)
export const formatNumber = (num) => {
  return Number(num).toLocaleString('en-PH');
};