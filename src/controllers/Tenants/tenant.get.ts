import {TenantRepository} from '../../repositories';
import {ErrorHandler} from '../../utils/errorHandler';

export const getTenantInfo = async (
  tenantRepository: TenantRepository,
  id: number,
) => {
  let tenantExist;

  // Check if tenant already exist
  try {
    tenantExist = await tenantRepository.findOne({
      where: {id: id, deletedAt: null},
    });
  } catch (err) {
    return new ErrorHandler(500, err.message || 'Internal Server Error');
  }

  if (!tenantExist) {
    return new ErrorHandler(400, 'Tenant Not Exist')
  }

  return {data: tenantExist, status: 'success', message: 'Tenant Data Retrived Successfully'}
};
