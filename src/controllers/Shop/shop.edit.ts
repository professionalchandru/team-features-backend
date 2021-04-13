import {ShopRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';
import {getTimestamp} from '../../utils/getTimeStamp';

export const shopEdit = async (
  shopRepository: ShopRepository,
  shop: any,
) => {
  let shopExist: any;

  // Check if shop already exist
  try {
    shopExist = await shopRepository.findOne({
      where: {id: shop.id, domain: shop.domain},
    });
  } catch (err) {
    return new ErrorHandler(500, err.message || 'Internal Server Error');
  }

  if (!shopExist) {
    return new ErrorHandler(400, 'Shop Does not Exist')
  }

  shop.updatedAt = getTimestamp()
  const data = await shopRepository.updateById(shop.id, shop);

  return {status: 'success', message: 'Shop Updated Successfully'}
};
