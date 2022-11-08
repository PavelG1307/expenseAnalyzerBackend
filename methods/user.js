const db = require('../db')

module.exports.editBalance = async (summ, userId) => {
    const query = `UPDATE users
    SET balance = balance - ${summ}
    WHERE users.id = ${userId}
    RETURNING balance`
    const balance = await db.query(query).catch((e) => console.log(e))
    return balance?.rows ? balance?.rows[0].balance : null
}