const User = require('../models/Customer');
const userManager = require('../managers/CustomerManager');
const authService = require('../services/auth.service');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

const CustomerController = () => {
  const create = async (req, res) => {
    const { body } = req;
    console.log('costomerId ========    ' + body.customerId);
    console.log('displayName ========    ' + body.displayName);

    try {
      const customer = await Customer.findOne({
        where: {
          customerId: body.customerId,
        },
      });

      if(!customer) {
        const customer = await Customer.create({
          customerId: body.customerId,
          displayName: body.displayName,
          totalBusiness: 0.0,
          numberOrder: 0,
          timeWorking: 0,
          listOrder: []
        });
        return res.status(200).json({ customer });

      } else {

        return res.status(200).json({  msg: 'duplicate customer' });
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Try create new customer later' });
  };

  const update = async (req, res) => {
    const { body } = req;
    console.log('userId ========    ' + body.userId);
    console.log('password ========    ' + body.password);
    try {
      const user = await User.findOne({
        where: {
          userId: body.userId
        },
      });

      if(!user) {
        return res.status(400).json({  msg: 'User is not exist' });
      } else {
        if ((bcryptService().comparePassword(body.password, user.password))){
            const token = authService().issue({ userId: user.id, role: user.userRole }); // need check jwt hoangdktd
            return res.status(200).json({  token, user });
        } else {
            return res.status(200).json({  msg: 'Wrong password' });
        }
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Email or Passwords don\'t match' });
  };
  return {
    register,
    login
  };
};

module.exports = AuthController;