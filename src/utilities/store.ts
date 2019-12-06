import { IStoreState, IAction, IAnyAction, IAnyEmptyAction, Reducer, ReducersMapObject } from '../types';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { scan, pluck, distinctUntilChanged } from 'rxjs/operators';

class Dispatcher<A extends IAction = IAnyAction> extends Subject<A> {
    public dispatch<T extends A>(action: T) {
        this.next(action);
    }
}

export function combineReducers<S extends IStoreState, A extends IAction = IAnyAction>(reducers: ReducersMapObject<S, A>): Reducer<S, A> {
    return (state: S = {} as S, action: A): S => {
        return Object.keys(reducers).reduce((nextState: any, key: string) => {
            nextState[key] = reducers[key](state[key], action);
            return nextState;
        }, {} as S);
    };
}

export class Store<S, A> extends BehaviorSubject<S> {
    public actions: A;
    public error$: Subject<Error>;
    public utilities: (errorStream: Subject<Error>) => any;
    private dispatcher: Dispatcher<any>;
    private reducer: Reducer<S>;

    constructor(reducer: Reducer<S>, actions: A, initialState: S = {} as S) {
        super(initialState);
        this.reducer = reducer;
        this.actions = actions;
        this.dispatcher = new Dispatcher();
        this.error$ = new Subject<Error>();

        this.dispatcher.asObservable().pipe(
            scan(this.scanFn(initialState), initialState)
        ).subscribe((state: S) => super.next(state));
    }

    public dispatch<T extends IAnyEmptyAction>(action: T): void;
    public dispatch<T extends IAnyAction>(action: T) {
        this.dispatcher.dispatch(action);
    }

    public next(action: any) {
        this.dispatcher.dispatch(action);
    }

    public select<K1 extends keyof S>(key1: K1): Observable<S[K1]>;
    public select<K1 extends keyof S, K2 extends keyof S[K1]>(key1: K1, key2: K2): Observable<S[K1][K2]>;
    public select<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(key1: K1, key2: K2, key3: K3): Observable<S[K1][K2][K3]>;
    public select<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3]>(key1: K1, key2: K2, key3: K3, key4: K4): Observable<S[K1][K2][K3][K4]>;
    public select<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3], K5 extends keyof S[K1][K2][K3][K4]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): Observable<S[K1][K2][K3][K4][K5]>;
    public select(...args: string[]): any {
        const keys = args.length > 1 ? args : args[0].split('.');

        return this.asObservable()
            .pipe(
                pluck(...keys),
                distinctUntilChanged()
            );
    }

    private onError(initialState: S, error: any): S {
        this.error$.next(error);
        return initialState;
    }

    private scanFn(initialState: S): (state: S, action: any) => S {
        return (state: S, action: any) => {
            try {
                return this.reducer(state, action);
            } catch (error) {
                return this.onError(initialState, error);
            }
        };
    }
}
