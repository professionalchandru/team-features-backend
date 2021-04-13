import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Tenant} from './tenant.model';

@model()
export class Shop extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  appId?: string;

  @property({
    type: 'string',
  })
  appSecret?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @property({
    type: 'string',
    required: true,
  })
  shopName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  domain: string;

  @property({
    type: 'number',
  })
  createdAt?: number;

  @property({
    type: 'number',
  })
  deletedAt?: number;

  @belongsTo(() => Tenant)
  tenantId: number;

  constructor(data?: Partial<Shop>) {
    super(data);
  }
}

export interface ShopRelations {
  // describe navigational properties here
}

export type ShopWithRelations = Shop & ShopRelations;
