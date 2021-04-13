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
  Shop,
} from '../models';
import {TenantUserRepository} from '../repositories';

export class TenantUserShopController {
  constructor(
    @repository(TenantUserRepository)
    public tenantUserRepository: TenantUserRepository,
  ) { }

  @get('/tenant-users/{id}/shop', {
    responses: {
      '200': {
        description: 'Shop belonging to TenantUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Shop)},
          },
        },
      },
    },
  })
  async getShop(
    @param.path.number('id') id: typeof TenantUser.prototype.id,
  ): Promise<Shop> {
    return this.tenantUserRepository.shop(id);
  }
}
