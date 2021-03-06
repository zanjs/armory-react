import config from 'config';
import * as ls from 'lib/localStorage';
import { generateActions } from './actions';

export default function gw2ReducerFactory (resourceName, getResource, {
  afterGet,
} = {}) {
  const LS_KEY = `${resourceName}_DATA`;
  const { fetching, result, error } = generateActions(resourceName, getResource, afterGet);
  const initialData = ls.get(LS_KEY);

  ls.clearIfPastStoreInterval(LS_KEY);

  return {
    reducer: (state, action) => {
      switch (action.type) {
        case fetching:
          return {
            ...state,
            fetching: action.payload,
          };

        case result: {
          const newState = {
            ...state,
            ...action.payload.data,
          };

          if (config.cache.saveToLs) {
            const saveState = {
              ...newState,
            };

            action.payload.noCache.forEach((id) => {
              delete saveState[id];
            });

            ls.set(LS_KEY, JSON.stringify(saveState));
          }

          return newState;
        }

        case error: {
          return {
            ...state,
            ...action.payload.ids.reduce((obj, id) => ({
              ...obj,
              [id]: {
                error: `ID:${id} | ${action.payload.message}`,
              },
            }), {}),
          };
        }

        default:
          return undefined;
      }
    },
    defaultState: {
      ...initialData && JSON.parse(initialData),
      fetching: false,
    },
  };
}
