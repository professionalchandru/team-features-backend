import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {TeamFeaturesDataSource} from '../datasources';
import {Shop, ShopRelations, Tenant} from '../models';
import {TenantRepository} from './tenant.repository';

export class ShopRepository extends DefaultCrudRepository<
  Shop,
  typeof Shop.prototype.id,
  ShopRelations
> {

  public readonly tenant: BelongsToAccessor<Tenant, typeof Shop.prototype.id>;

  constructor(
    @inject('datasources.team_features') dataSource: TeamFeaturesDataSource, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(Shop, dataSource);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
