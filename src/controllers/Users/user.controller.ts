import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch, post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {Users} from '../../models';
import {TenantUserRepository, UsersRepository} from '../../repositories';
import {StoreRepository} from '../../repositories/store.repository';
import {userLogin} from './user.login';
import {assignUserPermission} from './user.permission';
import {userRegister} from './user.register';

export class UserController {
  constructor(
    @repository(UsersRepository)
    public userRepository: UsersRepository,
    @repository(TenantUserRepository)
    public tenantUserRepository: TenantUserRepository,
    @repository(StoreRepository)
    public storeRepository: StoreRepository
  ) { }

  @post('/api/users/register')
  async createUser(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'tenantId'],
            properties: {
              name: {type: 'string'},
              email: {type: 'string'},
              password: {type: 'string'},
              tenantId: {type: 'number'},
              permission: {type: 'array'},
            },
            additionalProperties: {
              shopId: {type: 'number'}
            }
          },
        },
      },
    })
    user: any,
  ) {
    // Create New User
    return await userRegister(this.userRepository, this.tenantUserRepository, user);
  }


  @post('/api/shop/{shopId}/addTeam')
  async assignUserPermission(
    @param.path.number('shopId') shopId: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['tenantId'],
            properties: {
              users: {type: 'array'},
              tenantId: {type: 'number'},
              permission: {type: 'array'}
            },
          },
        },
      },
    })
    userData: any,
  ) {
    // Create New User
    return await assignUserPermission(this.tenantUserRepository, userData);
  }

  @post('/api/users/login')
  async loginUser(
    @repository(UsersRepository)
    userRepository: UsersRepository,
    @repository(StoreRepository)
    storeRepository: StoreRepository,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string'},
              password: {type: 'string'}
            },
          },
        },
      },
    })
    user: any,
  ) {
    // Verifying User Credential and return JWTToken
    return await userLogin(userRepository, storeRepository, user);
  }

  @get('/api/users/{tenantId}')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.path.number('tenantId') tenantId: number, @param.filter(Users) filter?: Filter<Users>) {
    return this.userRepository.execute(`SELECT * from users WHERE tenantId=${tenantId}`)
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Users, {exclude: 'where'}) filter?: FilterExcludingWhere<Users>,
  ): Promise<Users> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    user: Users,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: Users,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
