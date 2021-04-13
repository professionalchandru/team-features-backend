import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Tenant extends Entity {
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
      unique: true
    }
  })
  tenantName: string;

  @property({
    type: 'string',
    required: true,
  })
  accountType: string;

  @property({
    type: 'object',
  })
  settings?: object;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}

export interface TenantRelations {
  // describe navigational properties here
}

export type TenantWithRelations = Tenant & TenantRelations;
