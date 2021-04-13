import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'team_features',
  connector: 'postgresql',
  url: '',
  host: 'queenie.db.elephantsql.com',
  port: 5432,
  user: 'smmwaxmc',
  password: 'CxAJOIBBwVFCxijfl4hY8G19EYoGrGO4',
  database: 'smmwaxmc',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TeamFeaturesDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'team_features';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.team_features', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
