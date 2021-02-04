import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() {}

  /**
   * This function validate the logo, of the campaign to add.
   */
  validateLogo(logoImage): boolean {
    if (logoImage === null) {
      alert('Please, insert a logo.');
      return false;
    } else {
      return true;
    }
  }
  /**
   * This function validate the name, of the campaign to edit.
   */
  validateName(name: string): boolean {
    if (name === undefined) {
      alert('Name parameter must be filled!!!');
      return false;
    } else {
      return name.length > 0;
    }
  }

  /**
   * This function validate the description, of the campaign to edit.
   */
  validateDescription(description: string): boolean {
    if (description === undefined) {
      alert('Description parameter must be filled!!!');
      return false;
    } else {
      return description.length > 0;
    }
  }

  /**
   * This function validate the goal amount set, for the campaign to edit.
   */
  validateGoalAmount(goalAmount: number): boolean {
    if (goalAmount === undefined) {
      alert('Goal amount parameter must be filled!!!');
      return false;
    } else {
      return goalAmount > 0;
    }
  }

  /**
   * This function validates the iban, of the campaign to edit.
   */
  validateIBAN(iban: string): boolean {
    if (iban === undefined) {
      alert('IBAN must be filled!!!');
      return false;
    } else if (!this.isValidIBANNumber(iban)) {
      alert('IBAN must be valid!!!');
      return false;
    } else {
      iban = iban.toUpperCase();
      return true;
    }
  }

  /**
   * This function validates the array of responsibles, of the campaign to edit.
   */
  validateResponsibles(responsibles): boolean {
    this.removeSpaces(responsibles);
    if (responsibles === undefined || responsibles.length === 0) {
      alert('I must exist at least on responsible of this campaign!!!');
      return false;
    } else {
      return true;
    }
  }

  /**
   * This function validate a nif.
   */
  validateNIF(nif: number): boolean {
    if (nif === undefined) {
      alert('NIF must be filled!!!');
      return false;
    } else if (!this.isNIFValid(nif)) {
      alert('NIF must be valid!!!');
      return false;
    } else {
      return true;
    }
  }

  /**
   * This function validate a username.
   */
  validateUsername(username: string): boolean {
    if (username === undefined) {
      alert('Username must be filled!!!');
      return false;
    } else {
      return true;
    }
  }

  /**
   * This function validate a password.
   */
  validatePassword(password: string): boolean {
    if (password === undefined) {
      alert('Password must be filled!!!');
      return false;
    } else {
      return true;
    }
  }

  /**
   * This function validate a full name.
   */
  validateFullName(fullname: string): boolean {
    if (fullname === undefined) {
      alert('Full name must be filled!!!');
      return false;
    } else {
      return true;
    }
  }

  /**
   * This function validate a location.
   */
  validateLocation(coordinates: any, address: string): boolean {
    if (
      coordinates.latitude === undefined &&
      coordinates.latitude === undefined &&
      address === undefined
    ) {
      alert('Your option must be filled!!!');
      return false;
    } else {
      return true;
    }
  }

  /**
   * This function validates a NIF.
   * @param value
   */
  isNIFValid(value: any): boolean {
    const nif = typeof value === 'string' ? value : value.toString();
    const validationSets = {
      one: ['1', '2', '3', '5', '6', '8'],
      two: [
        '45',
        '70',
        '71',
        '72',
        '74',
        '75',
        '77',
        '79',
        '90',
        '91',
        '98',
        '99'
      ]
    };

    if (nif.length !== 9) {
      alert('NIF must be 9 digits!!!');
      return false;
    }

    if (
      !validationSets.one.includes(nif.substr(0, 1)) &&
      !validationSets.two.includes(nif.substr(0, 2))
    ) {
      return false;
    }
    const total =
      nif[0] * 9 +
      nif[1] * 8 +
      nif[2] * 7 +
      nif[3] * 6 +
      nif[4] * 5 +
      nif[5] * 4 +
      nif[6] * 3 +
      nif[7] * 2;
    const modulo11 = Number(total) % 11;
    const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;

    return checkDigit === Number(nif[8]);
  }

  /**
   * This function validates a IBAN number.
   * @param input This is a string with an iban.
   */
  isValidIBANNumber(input: any): boolean {
    let CODE_LENGTHS = {
      AD: 24,
      AE: 23,
      AT: 20,
      AZ: 28,
      BA: 20,
      BE: 16,
      BG: 22,
      BH: 22,
      BR: 29,
      CH: 21,
      CR: 21,
      CY: 28,
      CZ: 24,
      DE: 22,
      DK: 18,
      DO: 28,
      EE: 20,
      ES: 24,
      FI: 18,
      FO: 18,
      FR: 27,
      GB: 22,
      GI: 23,
      GL: 18,
      GR: 27,
      GT: 28,
      HR: 21,
      HU: 28,
      IE: 22,
      IL: 23,
      IS: 26,
      IT: 27,
      JO: 30,
      KW: 30,
      KZ: 20,
      LB: 28,
      LI: 21,
      LT: 20,
      LU: 20,
      LV: 21,
      MC: 27,
      MD: 24,
      ME: 22,
      MK: 19,
      MR: 27,
      MT: 31,
      MU: 30,
      NL: 18,
      NO: 15,
      PK: 24,
      PL: 28,
      PS: 29,
      PT: 25,
      QA: 29,
      RO: 24,
      RS: 22,
      SA: 24,
      SE: 24,
      SI: 19,
      SK: 24,
      SM: 27,
      TN: 24,
      TR: 26
    };

    let iban = input.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/),
      digits;

    if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
      return false;
    }

    digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, letter => {
      return letter.charCodeAt(0) - 55;
    });

    return this.mod97(digits) === 1;
  }

  /**
   * This function suport the function of validation of the  an IBAN.
   * @param string
   */
  mod97(string: any): number {
    let checksum = string.slice(0, 2),
      fragment;

    for (let offset = 2; offset < string.length; offset += 7) {
      fragment = checksum + string.substring(offset, offset + 7);
      checksum = parseInt(fragment, 10) % 97;
    }

    return checksum;
  }

  /**
   * This function removes the empty values of the responsibles.
   */
  removeSpaces(responsibles): void {
    responsibles = responsibles.filter(str => {
      return /\S/.test(str);
    });
  }

  /**
   * This obtains the current coordinates .
   */
  getLocation(callback): void {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          callback(position.coords.latitude, position.coords.longitude);
        },
        failure => {
          if (
            failure.message.indexOf('Only secure origins are allowed') === 0
          ) {
            alert('Only secure origins are allowed by your browser.');
          }
        }
      );
    } else {
      alert('Your browser doesn´t support geolocation.');
    }
  }
}
