import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Tenant} from './tenant.model';

@model({settings: {strict: true}})
export class Users extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  userType: string;

  @property({
    type: 'string'
  })
  password: string;

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
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
