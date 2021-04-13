import {ShopRepository, TenantUserRepository, UsersRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';
import {getTimestamp} from '../../utils/getTimeStamp';

export const shopRegister = async (
  userRepository: UsersRepository,
  tenantUserRepository: TenantUserRepository,
  shopRepository: ShopRepository,
  shop: any,
) => {
  let shopExist: any;

  // Check if shop already exist
  try {
    shopExist = await shopRepository.findOne({
      where: {domain: shop.domain},
    });
  } catch (err) {
    return new ErrorHandler(500, err.message || 'Internal Server Error');
  }

  if (shopExist) {
    return new ErrorHandler(400, 'Shop Already Exist')
  }

  // // Check already tenant has users
  // let checkNoOfUser = await userRepository.findOne({where: {tenantId: user.tenantId}})
  // if (checkNoOfUser) {
  //   user.userType = 'member'
  // } else {
  //   user.userType = 'owner'
  // }

  shop.createdAt = getTimestamp()
  const data = await shopRepository.save(shop);

  // Add user Id in Tenant User Table
  // await tenantUserRepository.create({tenantId: user.tenantId, userId: data.id, accessType: user.userType, permission: user.permission, createdAt: user.createdAt})

  return {data: data, status: 'success', message: 'Shop Added Successfully'}
};
