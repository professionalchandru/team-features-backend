import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TeamFeaturesDataSource} from '../datasources';
import {Tenant, TenantRelations} from '../models';

export class TenantRepository extends DefaultCrudRepository<
  Tenant,
  typeof Tenant.prototype.id,
  TenantRelations
> {
  constructor(
    @inject('datasources.team_features') dataSource: TeamFeaturesDataSource,
  ) {
    super(Tenant, dataSource);
  }
}
