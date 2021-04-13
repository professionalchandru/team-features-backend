import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Shop,
  Tenant,
} from '../models';
import {ShopRepository} from '../repositories';

export class ShopTenantController {
  constructor(
    @repository(ShopRepository)
    public shopRepository: ShopRepository,
  ) { }

  @get('/shops/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to Shop',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof Shop.prototype.id,
  ): Promise<Tenant> {
    return this.shopRepository.tenant(id);
  }
}
