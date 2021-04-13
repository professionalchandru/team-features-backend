import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch, post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {Tenant} from '../../models';
import {TenantRepository} from '../../repositories';
import {getTenantInfo} from './tenant.get';
import {tenantRegister} from './tenant.register';

export class TenantController {
  constructor(
    @repository(TenantRepository)
    public tenantRepository: TenantRepository,
  ) { }

  @post('/api/tenants/register')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['accountType'],
            properties: {
              tenantName: {type: 'string'},
              accountType: {type: 'string'},
              settings: {type: 'object'}
            }
          }
        },
      },
    })
    tenant: any,
  ) {
    return await tenantRegister(this.tenantRepository, tenant);
  }

  @get('/tenants')
  @response(200, {
    description: 'Array of Tenant model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tenant, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Tenant) filter?: Filter<Tenant>): Promise<Tenant[]> {
    return this.tenantRepository.find(filter);
  }

  @get('/api/tenants/{id}')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Tenant, {exclude: 'where'})
    filter?: FilterExcludingWhere<Tenant>,
  ) {
    return await getTenantInfo(this.tenantRepository, id)
    // return this.tenantRepository.findById(id, filter);
  }

  @patch('/tenants/{id}')
  @response(204, {
    description: 'Tenant PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, {partial: true}),
        },
      },
    })
    tenant: Tenant,
  ): Promise<void> {
    await this.tenantRepository.updateById(id, tenant);
  }

  @put('/tenants/{id}')
  @response(204, {
    description: 'Tenant PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tenant: Tenant,
  ): Promise<void> {
    await this.tenantRepository.replaceById(id, tenant);
  }

  @del('/tenants/{id}')
  @response(204, {
    description: 'Tenant DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tenantRepository.deleteById(id);
  }
}
