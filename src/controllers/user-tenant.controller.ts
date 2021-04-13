import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Tenant, Users
} from '../models';
import {UsersRepository} from '../repositories';

export class UserTenantController {
  constructor(
    @repository(UsersRepository)
    public userRepository: UsersRepository,
  ) { }

  @get('/users/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tenant)},
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.number('id') id: typeof Users.prototype.id,
  ): Promise<Tenant> {
    return this.userRepository.tenant(id);
  }
}
