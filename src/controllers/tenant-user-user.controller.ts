import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  TenantUser,
  Users
} from '../models';
import {TenantUserRepository} from '../repositories';

export class TenantUserUserController {
  constructor(
    @repository(TenantUserRepository)
    public tenantUserRepository: TenantUserRepository,
  ) { }

  @get('/tenant-users/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to TenantUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Users)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof TenantUser.prototype.id,
  ): Promise<Users> {
    return this.tenantUserRepository.user(id);
  }
}
