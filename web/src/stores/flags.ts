import store from './root';

export namespace Flags {
  export type MessageOverwrites = {
    [locale: string]: string;
  };

  export interface State {
    messageOverwrites: MessageOverwrites;
    homeHeroes: ('speak' | 'listen')[];
  }

  enum ActionType {
    SET = 'SET_FLAGS',
  }

  interface SetFlags {
    type: ActionType.SET;
    state: State;
  }

  export type Action = SetFlags;

  export const actions = {
    set: (state: State) => ({
      type: ActionType.SET,
      state,
    }),
  };

  // needs refactoring
  export function reducer(
    state: State = {
      messageOverwrites: JSON.parse(
        store
          ? store.getState().user.cookiesAgreed
            ? sessionStorage.getItem('messageOverwrites') || '{}'
            : '{}'
          : '{}'
      ),
      homeHeroes: ['speak', 'listen'],
    },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.SET:
        return { ...state, ...action.state };

      default:
        return state;
    }
  }
}
