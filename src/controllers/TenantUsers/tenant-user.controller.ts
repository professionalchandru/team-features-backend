import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {TenantUser} from '../../models';
import {TenantUserRepository} from '../../repositories';
import {updateUserPermission} from './tenant-user.updatePermission';


export class TenantUserController {
  constructor(
    @repository(TenantUserRepository)
    public tenantUserRepository: TenantUserRepository,
  ) { }

  @post('/tenant-users')
  @response(200, {
    description: 'TenantUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(TenantUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantUser, {
            title: 'NewTenantUser',
            exclude: ['id'],
          }),
        },
      },
    })
    tenantUser: Omit<TenantUser, 'id'>,
  ): Promise<TenantUser> {
    return this.tenantUserRepository.create(tenantUser);
  }

  @get('/tenant-users/count')
  @response(200, {
    description: 'TenantUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TenantUser) where?: Where<TenantUser>,
  ): Promise<Count> {
    return this.tenantUserRepository.count(where);
  }

  @get('/tenant-users')
  @response(200, {
    description: 'Array of TenantUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TenantUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TenantUser) filter?: Filter<TenantUser>,
  ): Promise<TenantUser[]> {
    return this.tenantUserRepository.find(filter);
  }

  @patch('/tenant-users')
  @response(200, {
    description: 'TenantUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantUser, {partial: true}),
        },
      },
    })
    tenantUser: TenantUser,
    @param.where(TenantUser) where?: Where<TenantUser>,
  ): Promise<Count> {
    return this.tenantUserRepository.updateAll(tenantUser, where);
  }

  @get('/api/tenant-users/{id}')
  @response(200, {
    description: 'TenantUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TenantUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TenantUser, {exclude: 'where'})
    filter?: FilterExcludingWhere<TenantUser>,
  ) {
    return this.tenantUserRepository.findOne({where: {userId: id}})
    // return this.tenantUserRepository.findById(id, filter);
  }

  @patch('/tenant-users/{id}')
  @response(204, {
    description: 'TenantUser PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantUser, {partial: true}),
        },
      },
    })
    tenantUser: TenantUser,
  ): Promise<void> {
    await this.tenantUserRepository.updateById(id, tenantUser);
  }

  @patch('/api/tenant-users/permission/{userId}')
  @response(204, {
    description: 'TenantUser PATCH success',
  })
  async updateByUserId(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            permission: {type: 'array'}
          },
        },
      },
    })
    tenantUser: any,
  ) {
    return await updateUserPermission(this.tenantUserRepository, tenantUser)
  }

  @put('/tenant-users/{id}')
  @response(204, {
    description: 'TenantUser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tenantUser: TenantUser,
  ): Promise<void> {
    await this.tenantUserRepository.replaceById(id, tenantUser);
  }

  @del('/api/{tenantId}/shops/{shopId}/delete/user/{userId}')
  @response(204, {
    description: 'TenantUser DELETE success',
  })
  async deleteById(@param.path.number('tenantId') tenantId: number, @param.path.number('shopId') shopId: number, @param.path.number('userId') userId: number,) {
    let result = await this.tenantUserRepository.execute(`DELETE FROM tenantUser WHERE tenantId=${tenantId} AND shopId=${shopId} AND userId=${userId}`)
    console.log("result", result)
    if (result) {

      return {status: 'success', message: 'User Removed Successfully'}
    }
  }
}
