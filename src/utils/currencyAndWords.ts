export function formatCurrencyAmount(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0.00';
  }
  return Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function cleanItemName(name: string): string {
  if (!name) return '';
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim() || name;
}

const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertLessThanThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return units[n];
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
  }
  return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanThousand(n % 100) : '');
}

export function numberToWords(amount: number, currencyName: string = 'BDT'): string {
  if (isNaN(amount) || amount <= 0) return 'Zero ' + currencyName + ' Only';

  const fixed = Math.abs(amount).toFixed(2);
  const parts = fixed.split('.');
  const wholePart = parseInt(parts[0], 10);
  const fracPart = parseInt(parts[1], 10);

  let result = '';

  if (wholePart === 0) {
    result = 'Zero';
  } else {
    let n = wholePart;
    let str = '';

    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const hundred = n;

    if (crore > 0) {
      str += convertLessThanThousand(crore) + ' Crore ';
    }
    if (lakh > 0) {
      str += convertLessThanThousand(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      str += convertLessThanThousand(thousand) + ' Thousand ';
    }
    if (hundred > 0) {
      str += convertLessThanThousand(hundred) + ' ';
    }
    result = str.trim();
  }

  result += ` ${currencyName}`;

  if (fracPart > 0) {
    const fracStr = convertLessThanThousand(fracPart);
    const subUnitName =
      currencyName === 'BDT' || currencyName === 'Tk' || currencyName === '৳'
        ? 'Paisa'
        : currencyName === 'OMR'
        ? 'Baisa'
        : 'Cents';
    result += ` and ${fracStr} ${subUnitName}`;
  }

  result += ' Only';
  return result;
}
