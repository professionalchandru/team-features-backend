import {ShopRepository, TenantUserRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';

export const getShopsByUserId = async (
  tenantUserRepository: TenantUserRepository,
  shopRepository: ShopRepository,
  tenantId: number,
  userId: number,
  filter: any
) => {

  let user: any;
  let shops: any

  // Check the user is owner or member
  try {
    user = await tenantUserRepository.findOne({
      where: {tenantId: tenantId, userId: userId},
    });
  } catch (error) {
    return new ErrorHandler(500, error.message || 'Internal Server Error');
  }

  // Get shops for curresponding tenant and corresponding user
  if (user.accessType === 'owner') {
    shops = await shopRepository.find({where: {tenantId: user.tenantId}})
  } else if (user.accessType === 'member' && user.shopId && user.tenantId) {
    shops = await shopRepository.execute(`SELECT shop.id, appId, appSecret, type, email, domain, shopName, accessType, shop.createdAt, tenantUser.tenantId, tenantUser.userId, permission FROM shop INNER JOIN tenantuser ON shop.id = tenantUser.shopId WHERE tenantUser.userId =  ${userId}`)
  }

  return {data: shops, status: 'success', message: 'Shop Retrived Successfully'}

};
