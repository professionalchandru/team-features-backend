import {TenantUserRepository} from '../../repositories';
import {getTimestamp} from '../../utils/getTimeStamp';

export const updateUserPermission = async (
  tenantUserRepository: TenantUserRepository,
  tenantUser: any,
) => {

  tenantUser.updatedAt = getTimestamp();

  // Filter permission key and value
  var object = tenantUser.permission.permission.reduce(
    (obj: any, item: any) => Object.assign(obj, {[item.permission]: item.value}), {});

  tenantUser.permission = object;


  await tenantUserRepository.updateAll({permission: tenantUser.permission, updatedAt: tenantUser.updatedAt}, {userId: tenantUser.userId, tenantId: tenantUser.tenantId, shopId: tenantUser.shopId})

  return {status: 'success', message: 'User Permission Updated Successfully'};
};
