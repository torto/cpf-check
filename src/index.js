// @flow

/**
 * Determines if given input is a string.
 *
 * @param      {Any}   stg     The input.
 * @return     {boolean}  True if string, False otherwise.
 */
function isString(stg: any): Boolean {
    // failproffish check
    return stg.constructor.toString().indexOf('String') !== -1;
}

/**
 * Returns a random number inside the min-max window.
 *
 * @param      {number}  max     The maximum number.
 * @param      {number}  min     The minimum number.
 * @return     {number}  the random number.
 */
function random(max: Number, min: Number): Number {
    // Round given range numbers
    const rMin = Math.ceil(min);
    const rMax = Math.floor(max);

    // Generates a pseudo-random number with the given range
    return Math.floor(Math.random() * (rMax - (rMin + 1))) + rMin;
}

/**
 * Returns the verifier digit for a given input.
 *
 * @param      {Array}   digits  The CPF digits.
 * @return     {Number}  The verifier digit.
 */
function checkSum(digits: Array): Number {
    if (!Array.isArray(digits)) {
        throw new Error(`CPF.checkSum Error\nExpected digits to be an array but instead got ${typeof digits}`);
    }

    const size = digits.length + 1;

    // Do some magic. JK. forEach number, we multiply it by the array size
    // plus one (10 or 11 if cpf is valid). Than we sum all the indexes
    const sum = digits
        .map((number, index) => number * (size - index))
        .reduce((total, number) => total + number);

    // We then multiply by 10 and get the remainder of dividing by 11.
    const remainder = (sum * 10) % 11;

    // If the remainder is 10 or 11, return 0, else return the remainder.
    return remainder > 9 ? 0 : remainder;
}

export default class CPF {
    constructor(raw: String): Boolean {
        return CPF.validate(raw);
    }

    /**
     * Parse a CPF from any text. For example 'this is my cpf 000.000.000-00'
     * will return '000.000.000-00'.
     *
     * @param      {string}  raw     The raw text string.
     * @return     {string}  the found CPF or an empty string.
     */
    static parse(raw: String): String {
        if (!isString(raw)) {
            throw new Error(`CPF.parse Error\nExpected String but instead got ${typeof raw}`);
        }
        // Extracts all cpf matches from an text string
        const matches = raw.match(/\d{3}(.|-)?\d{3}(.|-)?\d{3}(.|-)?\d{2}/);

        // If no matches
        if (matches === null) {
            return '';
        }

        // Return the first match
        return matches[0];
    }

   
    /**
     * Strip '-', '.', and anything that is not a digit from the provided input.
     *
     * @param      {string}  raw     The text input.
     * @return     {string}  Striped down input.
     */
    static strip(raw: String): String {
        if (!isString(raw)) {
            throw new Error(`CPF.strip Error\nExpected String but instead got ${typeof raw}`);
        }

        return raw.replace(/[^\d]/g, '').trim();
    }

    /**
     * Format a given cpf. For example '00000000000' will result in
     * '000.000.000-00'.
     *
     * @param      {string}  raw     The unformated CPF.
     * @return     {string}  The formated CPF.
     */
    static format(raw: String): String {
        if (!isString(raw)) {
            throw new Error(`CPF.format Error\nExpected String but instead got ${typeof raw}`);
        }

        const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
        return strip(parse(raw)).replace(regex, '$1.$2.$3-$4');
    }

    /**
     * Transforms a given CPF string into an Array of the cpfs numbers.
     *
     * @param      {string}  raw     The raw cpf string.
     * @return     {Array}   CPF parsed numbers in an array.
     */
    static transform(raw: String): Array {
        if (!isString(raw)) {
            throw new Error(`CPF.format Error\nExpected String but instead got ${typeof raw}`);
        }

        // Transform input into array and parse the numbers
        const digits = raw.split('').map(digit => parseInt(digit, 10));

        // if the input did't contain a CPF, parseInt will return NaN, so
        // we check for this.
        for (let i = digits.length - 1; i >= 0; i -= 1) {
            if (Number.isNaN(digits[i])) {
                throw new Error(`CPF.transform Error\nExpected digits only string but instead got ${raw}`);
            }
        }

        return digits;
    }

    /**
     * Validates a given CPF.
     *
     * @param      {string}   raw     The raw cpf string, it can be dirty, like
     *                                'my cpf is 000.000.000-00'.
     * @return     {boolean}  True if valid, False otherwise.
     */
    static validate(raw: String): Boolean {
        if (!isString(raw)) {
            throw new Error(`CPF.validate Error\nExpected CPF to be a string, instead got ${typeof raw}`);
        }

        // Get the Array<Number> for the CPF's digits
        const digits = transform(strip(parse(raw)));

        // If length is not 11, CPF is not valid!
        if (digits.length !== 11) {
            return false;
        }

        // We extract the verifier digits from the CPF digits
        const verifiers = digits.slice(9, 11);

        // We compute the correct verifiers based on the 9 first digits
        const first = checkSum(digits.slice(0, 9));
        const second = checkSum(digits.slice(0, 9).concat([first]));

        // We check if the provided verifiers match the computed ones
        if (verifiers[0] === first && verifiers[1] === second) {
            return true;
        }

        return false;
    }

    /**
     * Generates a given CPF
     *
     * @return     {String}  The generated CPF
     */
    static generate(): String {
        let randomNum = '';

        // We generate the first nine digits randomly
        for (let i = 0; i < 9; i += 1) {
            randomNum = randomNum.concat(random(9, 1).toString(10));
        }

        // We transform the random digits into an Array<Number> of the digits.
        const digits = transform(randomNum);

        // Generate the verifiers based on the random digits
        const first = checkSum(digits.slice(0, 9));
        const second = checkSum(digits.slice(0, 9).concat([first]));

        // Return a formated version
        return format(`${digits.join('')}${first}${second}`);
    }
}

export default CPF;
