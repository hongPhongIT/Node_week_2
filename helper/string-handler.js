const bcrypt = require('bcrypt');
const saltRounds = 10;

export default class StringHandler {

    static async hashStringToBcryt(string) {
        const salt = await bcrypt.genSaltSync(saltRounds);
        const hash = await bcrypt.hashSync(string, salt);
        return hash;
    }

}