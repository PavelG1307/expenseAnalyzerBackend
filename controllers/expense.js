const db = require('../db')
const user = require('../methods/user')

const controller = {
  create: async (req, res) => {
    const { value, type, unexpected, comment, profit } = req.body
    const query = `
    INSERT INTO expense
    (value, type, unexpected, comment, profit, "user", date)
    VALUES 
    (${value}, ${type}, ${unexpected || 'false'}, '${comment || ''}', ${profit || false}, 1, NOW())`
    const balance = await user.editBalance(value, 1)
    const success = await db.query(query).catch((e) => console.log(e))
    res.json({ success: !!success, balance })
  },
  get: async (req, res) => {
    const { token } = req.query
    const query = `
      SELECT date, value, unexpected, comment, type, "user" as user, profit, name, balance
      FROM expense as e
      JOIN users as u ON u.id = "user"
      WHERE u.token = '${token}'`
    const expence = await db.query(query).catch((e) => console.log(e))
    if (!expence?.rows[0]) {
      res.json({success: false})
      return
    }
    res.json({success: true, data: expence.rows})
  }
};


module.exports = (method) => {
  return async function (request, response, next) {
    try {
      await controller[method](request, response, next);
    } catch (error) {
      return next(error);
    }
  };
};
