import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {TeamFeaturesDataSource} from '../datasources';
import {Shop, Tenant, TenantUser, TenantUserRelations, Users} from '../models';
import {ShopRepository} from './shop.repository';
import {TenantRepository} from './tenant.repository';
import {UsersRepository} from './user.repository';

export class TenantUserRepository extends DefaultCrudRepository<
  TenantUser,
  typeof TenantUser.prototype.id,
  TenantUserRelations
> {

  public readonly tenant: BelongsToAccessor<Tenant, typeof TenantUser.prototype.id>;

  public readonly user: BelongsToAccessor<Users, typeof TenantUser.prototype.id>;

  public readonly shop: BelongsToAccessor<Shop, typeof TenantUser.prototype.id>;

  constructor(
    @inject('datasources.team_features') dataSource: TeamFeaturesDataSource, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UsersRepository>, @repository.getter('ShopRepository') protected shopRepositoryGetter: Getter<ShopRepository>,
  ) {
    super(TenantUser, dataSource);
    this.shop = this.createBelongsToAccessorFor('shop', shopRepositoryGetter,);
    this.registerInclusionResolver('shop', this.shop.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.tenant = this.createBelongsToAccessorFor('tenant', tenantRepositoryGetter,);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
