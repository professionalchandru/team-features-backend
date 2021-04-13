import {TenantUserRepository, UsersRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';

export const getUsersByShopId = async (
  tenantUserRepository: TenantUserRepository,
  userRepository: UsersRepository,
  tenantId: number,
  shopId: number
) => {

  let adminUser: any
  let shopArray: any
  let usersArray: any

  try {
    // Get the Users for corresponding shops
    // adminUser = await tenantUserRepository.find({
    //   where: {tenantId: tenantId, accessType: 'owner'}
    // })

    adminUser = await userRepository.execute(`SELECT users.id, userType, email, name, tenantUser.permission FROM users INNER JOIN tenantUser ON users.id = tenantuser.userId WHERE tenantUser.tenantId = ${tenantId} AND tenantUser.accessType = 'owner'`)
  } catch (error) {
    return new ErrorHandler(500, error.message || 'Internal Server Error');
  }

  shopArray = await userRepository.execute(`SELECT users.id, userType, email, name, tenantUser.permission FROM users INNER JOIN tenantUser ON users.id = tenantUser.userId WHERE tenantUser.tenantId = ${tenantId} AND tenantUser.shopId = ${shopId}`)


  if (!adminUser && !shopArray) {
    return new ErrorHandler(400, 'No User Exist For The Shop');
  }

  if (shopArray && adminUser) {
    usersArray = shopArray.concat(adminUser)
  }
  if (adminUser && !shopArray) {
    usersArray = adminUser
  }


  return {data: usersArray, status: 'success', message: 'Users Retrived Successfully'}

};
