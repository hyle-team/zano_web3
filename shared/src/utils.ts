import Decimal from "decimal.js";

export function validateTokensInput(input: string | number, decimal_point: number = 12) {

    if (typeof input === 'number') {
        input = input.toString();
    }

    if (input === "") {
        return {
            valid: false,
            error: 'Invalid input',
        };
    }
  
    input = input.replace(/[^0-9.,]/g, '');
  
    const MAX_NUMBER = new Decimal(2).pow(64).minus(1);
  
    if (decimal_point < 0 || decimal_point > 18) {
        return {
            valid: false,
            error: 'Invalid decimal point',
        };
    }
  
    const dotInput = input.replace(/,/g, '.');
  
    const decimalDevider = new Decimal(10).pow(decimal_point);
  
    const maxAllowedNumber = MAX_NUMBER.div(decimalDevider);
  
    const minAllowedNumber = new Decimal(1).div(decimalDevider);
  
    const rounded = (() => {
        if (dotInput.replace('.', '').length > 20) {
            const decimalParts = dotInput.split('.');
  
            if (decimalParts.length === 2 && decimalParts[1].length > 1) {
                const beforeDotLength = decimalParts[0].length;
                const roundedInput = new Decimal(dotInput).toFixed(Math.max(20 - beforeDotLength, 0));
  
                if (roundedInput.replace(/./g, '').length <= 20) {
                    return roundedInput;
                }
            }
  
            return false;
        } else {
            return dotInput;
        }
    })();
    
    const decimalsAmount = dotInput.split('.')[1]?.length || 0;

    if (decimalsAmount > decimal_point) {
        return {
            valid: false,
            error: 'Invalid amount - too many decimal points',
        };
    }
  
    if (rounded === false) {
        return {
            valid: false,
            error: 'Invalid amount - number is too big or has too many decimal points',
        };
    }
  
    const dotInputDecimal = new Decimal(rounded);
      
    if (dotInputDecimal.gt(maxAllowedNumber)) {
        return {
            valid: false,
            error: 'Invalid amount - number is too big',
        };
    }
  
    if (dotInputDecimal.lt(minAllowedNumber)) {
        return {
            valid: false,
            error: 'Invalid amount - number is too small',
        };
    }
  
    return {
        valid: true
    };
}