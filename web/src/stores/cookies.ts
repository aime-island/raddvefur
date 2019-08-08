import { Dispatch } from 'redux';
import StateTree from './tree';

export namespace Cookies {
  export interface State {
    set: boolean;
    ud: boolean;
    ga: boolean;
  }

  function getDefaultState(): State {
    return {
      set: false,
      ud: false,
      ga: false,
    };
  }

  enum ActionType {
    UPDATE = 'UPDATE_SETTING',
  }

  interface UpdateAction {
    type: ActionType.UPDATE;
    state: Partial<State>;
  }

  export type Action = UpdateAction;

  export const actions = {
    update: (state: Partial<State>): UpdateAction => ({
      type: ActionType.UPDATE,
      state,
    }),
  };

  export function reducer(state = getDefaultState(), action: Action): State {
    switch (action.type) {
      case ActionType.UPDATE:
        return { ...state, ...action.state };

      default:
        return state;
    }
  }
}
