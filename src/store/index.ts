import { IState } from '../types';
import { Singleton } from '../utilities/dependency-injection';
import { Store } from '../utilities/store';
import { EntitiesAggregate } from './aggregates/entities';
import { IntegrationsAggregate } from './aggregates/integrations';
import { ProfilesAggregate } from './aggregates/profiles';
import { GroupsAggregate } from './aggregates/groups';
import { PagesAggregate } from './aggregates/pages';
import actions from './actions';
import initialState from './initial-state';
import reducers from './reducers';

type YioStoreActions = typeof actions;

@Singleton
export class YioStore extends Store<IState, YioStoreActions> {
	public entities: EntitiesAggregate;
	public integrations: IntegrationsAggregate;
	public profiles: ProfilesAggregate;
	public pages: PagesAggregate;
	public groups: GroupsAggregate;

	constructor() {
		super(reducers, actions, initialState);
		this.entities = new EntitiesAggregate(this);
		this.integrations = new IntegrationsAggregate(this);
		this.groups = new GroupsAggregate(this);
		this.pages = new PagesAggregate(this);
		this.profiles = new ProfilesAggregate(this);
	}
}
