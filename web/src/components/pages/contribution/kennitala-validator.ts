/*
Copyright © 2019 eMedia Intellect.

This file is part of eMI Kennitala Validator.

eMI Kennitala Validator is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

eMI Kennitala Validator is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with eMI Kennitala Validator. If not, see http://www.gnu.org/licenses/.
*/

export enum KennitalaType {
  Invalid,
  Individual,
  Organisation,
}

export class Kennitala {
  static Validate(kennitala: string): KennitalaType {
    // The national identification number is 10 digits long.
    if (kennitala.length === 10) {
      if (kennitala == '0000000000') {
        return KennitalaType.Invalid;
      }

      let digit1 = parseInt(kennitala[0]); // Birth/Founding day
      let digit2 = parseInt(kennitala[1]); // Birth/Founding day
      let digit3 = parseInt(kennitala[2]); // Birth/Founding month
      let digit4 = parseInt(kennitala[3]); // Birth/Founding month
      let digit5 = parseInt(kennitala[4]); // Birth/Founding year
      let digit6 = parseInt(kennitala[5]); // Birth/Founding year
      let digit7 = parseInt(kennitala[6]); // Random digit
      let digit8 = parseInt(kennitala[7]); // Random digit
      let digit9 = parseInt(kennitala[8]); // Check digit
      let digit10 = parseInt(kennitala[9]); // Century: 8 (1800–1899), 9 (1900–1999), 0 (2000–2099)

      // All digits must be within their respective ranges.
      if (
        digit1 >= 0 &&
        digit1 <= 7 &&
        (digit2 >= 0 && digit2 <= 9) &&
        (digit3 === 0 || digit3 === 1) &&
        (digit4 >= 0 && digit4 <= 9) &&
        (digit5 >= 0 && digit5 <= 9) &&
        (digit6 >= 0 && digit6 <= 9) &&
        (digit7 >= 0 && digit7 <= 9) &&
        (digit8 >= 0 && digit8 <= 9) &&
        (digit9 >= 0 && digit9 <= 9) &&
        (digit10 === 0 || digit10 === 8 || digit10 === 9)
      ) {
        let checkDigit =
          (digit1 * 3 +
            digit2 * 2 +
            digit3 * 7 +
            digit4 * 6 +
            digit5 * 5 +
            digit6 * 4 +
            digit7 * 3 +
            digit8 * 2) %
          11;

        // The check digit may be 0. Otherwise it is subtracted from 11.
        if (checkDigit > 0) {
          checkDigit = 11 - checkDigit;
        }

        // The check digit must equal digit 9.
        if (checkDigit === digit9) {
          // Digit 1 of organisations is between 4 and 7.
          if (digit1 === 4 || digit1 === 5 || digit1 === 6 || digit1 === 7) {
            return KennitalaType.Organisation;
          }

          return KennitalaType.Individual;
        }
      }
    }

    return KennitalaType.Invalid;
  }
}
