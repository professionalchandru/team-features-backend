import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TeamFeaturesDataSource} from '../datasources';
import {Store, StoreRelations} from '../models';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id,
  StoreRelations
> {
  constructor(
    @inject('datasources.team_features') dataSource: TeamFeaturesDataSource,
  ) {
    super(Store, dataSource);
  }
}
