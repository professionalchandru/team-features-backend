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
import {Shop} from '../../models';
import {ShopRepository, TenantUserRepository, UsersRepository} from '../../repositories';
import {shopEdit} from './shop.edit';
import {getShopsByUserId} from './shop.getShopForUser';
import {getUsersByShopId} from './shop.getUsersForShop';
import {shopRegister} from './shop.register';

export class ShopController {
  constructor(
    @repository(ShopRepository)
    public shopRepository: ShopRepository,
    @repository(UsersRepository)
    public userRepository: UsersRepository,
  ) { }

  @post('/api/shops/create')
  async create(
    @repository(UsersRepository)
    userRepository: UsersRepository,
    @repository(TenantUserRepository)
    tenantUserRepository: TenantUserRepository,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            required: ['email', 'domain', 'userId', 'tenantId'],
            properties: {
              userId: {type: 'number'},
              type: {type: 'string'},
              email: {type: 'string'},
              domain: {type: 'string'},
              shopName: {type: 'string'},
              tenantId: {type: 'number'},
            }
          }
        },
      },
    })
    shop: any,
  ) {
    return shopRegister(userRepository, tenantUserRepository, this.shopRepository, shop)
  }


  @get('/api/{tenantId}/shops')
  async find(
    @param.filter(Shop) filter?: Filter<Shop>,
  ): Promise<Shop[]> {
    return this.shopRepository.find(filter);
  }

  @get('/api/{tenantId}/user/{userId}/shops')
  async getShopsForUser(
    @repository(TenantUserRepository)
    tenantUserRepository: TenantUserRepository,
    @param.path.number("tenantId") tenantId: number,
    @param.path.number("userId") userId: number,
    @param.filter(Shop) filter?: Filter<Shop>,
  ) {
    return getShopsByUserId(tenantUserRepository, this.shopRepository, tenantId, userId, filter)
  }


  @get('/api/{tenantId}/shop/{shopId}/team')
  async getUsersForShop(
    @repository(TenantUserRepository)
    tenantUserRepository: TenantUserRepository,
    @param.path.number("tenantId") tenantId: number,
    @param.path.number("shopId") shopId: number,
    @param.filter(Shop) filter?: Filter<Shop>,
  ) {
    return getUsersByShopId(tenantUserRepository, this.userRepository, tenantId, shopId)
  }

  @patch('/shops')
  @response(200, {
    description: 'Shop PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shop, {partial: true}),
        },
      },
    })
    shop: Shop,
    @param.where(Shop) where?: Where<Shop>,
  ): Promise<Count> {
    return this.shopRepository.updateAll(shop, where);
  }

  @get('/api/shops/{id}')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Shop, {exclude: 'where'}) filter?: FilterExcludingWhere<Shop>
  ): Promise<Shop> {
    return this.shopRepository.findById(id, filter);
  }

  @patch('/api/shops/{id}')
  @response(204, {
    description: 'Shop PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              type: {type: 'string'},
              email: {type: 'string'},
              domain: {type: 'string'},
              shopName: {type: 'string'},
            }
          },
        },
      },
    })
    shop: any,
  ) {
    shop.id = id
    return shopEdit(this.shopRepository, shop)
  }

  @put('/shops/{id}')
  @response(204, {
    description: 'Shop PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() shop: Shop,
  ): Promise<void> {
    await this.shopRepository.replaceById(id, shop);
  }

  @del('/api/shops/{id}')
  @response(204, {
    description: 'Shop DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.shopRepository.deleteById(id);
  }
}
