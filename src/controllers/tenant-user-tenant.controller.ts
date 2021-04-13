import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TenantUser,
  Tenant,
} from '../models';
import {TenantUserRepository} from '../repositories';

export class TenantUserTenantController {
  constructor(
    @repository(TenantUserRepository)
    public tenantUserRepository: TenantUserRepository,
  ) { }

  @get('/tenant-users/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to TenantUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof TenantUser.prototype.id,
  ): Promise<Tenant> {
    return this.tenantUserRepository.tenant(id);
  }
}
