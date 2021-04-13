import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Shop} from './shop.model';
import {Tenant} from './tenant.model';
import {Users} from './user.model';

@model()
export class TenantUser extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  accessType: string;

  @property({
    type: 'object'
  })
  permission: object;

  @property({
    type: 'number',
  })
  createdAt?: number;

  @property({
    type: 'number',
  })
  updatedAt?: number;

  @property({
    type: 'number',
  })
  deletedAt?: number;

  @belongsTo(() => Tenant)
  tenantId: number;

  @belongsTo(() => Users)
  userId: number;

  @belongsTo(() => Shop)
  shopId: number;

  constructor(data?: Partial<TenantUser>) {
    super(data);
  }
}

export interface TenantUserRelations {
  // describe navigational properties here
}

export type TenantUserWithRelations = TenantUser & TenantUserRelations;
