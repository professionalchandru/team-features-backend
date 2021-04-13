import {TenantUserRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';
import {getTimestamp} from '../../utils/getTimeStamp';

export const assignUserPermission = async (
  tenantUserRepository: TenantUserRepository,
  userData: any,
) => {
  let userExist: any;

  let usersArray = userData.users
  delete userData.users
  userData.accessType = 'member';

  userData.createdAt = getTimestamp();

  // Filter permission key and value
  let reduce = userData.permission.reduce(
    (obj: any, item: any) => ({...obj, [item.permission]: item.value}),
    {},
  );
  userData.permission = reduce;

  // Check if user already exist
  for (const user of usersArray) {
    try {
      userExist = await tenantUserRepository.findOne({
        where: {userId: user.id, shopId: userData.shopId, tenantId: userData.tenantId},
      });
    } catch (err) {
      return new ErrorHandler(500, err.message || 'Internal Server Error');
    }

    if (userExist) {
      return new ErrorHandler(400, 'User Permissions Already Exist')
    }
  }

  // Add users and permission in tenant user table
  usersArray.map(async (user: any) => {
    let finalDetails = {
      tenantId: userData.tenantId,
      shopId: userData.shopId,
      userId: user.id,
      accessType: userData.accessType,
      permission: userData.permission,
      createdAt: userData.createdAt
    }

    return await tenantUserRepository.create(finalDetails)
  })

  return {status: 'success', message: 'User Permission Added Successfully'};
};
