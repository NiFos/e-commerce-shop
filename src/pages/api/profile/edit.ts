import { NextApiResponse } from 'next';
import { withMethod } from '../../../libs/withMethod';
import { NextApiRequestWithUser, withUser } from '../../../libs/withUser';
import { userModel } from '../../../models/user';

/**
 * Edit user profile data
 */
async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    const user = req.user;
    if (typeof user?.id === 'undefined') throw 'Unauthorized';

    const { phone, deliveryaddress } = req.body;

    const payload: any = {};
    if (phone) payload.phone = phone;
    if (deliveryaddress) payload.delivery_address = deliveryaddress;

    const updated = await userModel.editUserInformation(user.id, payload);
    if (updated <= 0) throw 'Not found!';

    return res.json({
      user: {
        userId: user.id,
        username: user.username,
        phone: phone,
        deliveryAddress: deliveryaddress,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.toString(),
    });
  }
}

export default withMethod(withUser(handler), 'POST');
