import {TenantRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';
import {getTimestamp} from '../../utils/getTimeStamp';

export const tenantRegister = async (
  tenantRepository: TenantRepository,
  tenant: any,
) => {
  let tenantExist;

  // Check if tenant already exist
  try {
    tenantExist = await tenantRepository.findOne({
      where: {tenantName: tenant.tenantName, deletedAt: null},
    });
  } catch (err) {
    return new ErrorHandler(500, err.message || 'Internal Server Error');
  }

  if (tenantExist) {
    return new ErrorHandler(400, 'Tenant Already Exist')
  }
  tenant.createdAt = getTimestamp()
  const data = await tenantRepository.save(tenant);

  return {data: data, status: 'success', message: 'Tenant Created Successfully'}
};
