import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {TeamFeaturesDataSource} from '../datasources';
import {Tenant, Users, UsersRelations} from '../models';
import {TenantRepository} from './tenant.repository';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {

  public readonly tenant: BelongsToAccessor<Tenant, typeof Users.prototype.id>;

  constructor(
    @inject('datasources.team_features') dataSource: TeamFeaturesDataSource, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(Users, dataSource);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
