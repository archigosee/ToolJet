import { shallow } from 'zustand/shallow';
import { create, zustandDevTools } from './utils';
import _, { omit } from 'lodash';
import { useResolveStore } from './resolverStore';
import { handleLowPriorityWork } from '@/_helpers/editorHelpers';
import { useContext } from 'react';
import { useSuperStore } from './superStore';
import { ModuleContext } from '../_contexts/ModuleContext';

export function createCurrentStateStore(moduleName) {
  const initialState = {
    queries: {},
    components: {},
    globals: {
      theme: { name: 'light' },
      urlparams: null,
    },
    errors: {},
    variables: {},
    client: {},
    server: {},
    page: {
      handle: '',
      variables: {},
    },
    succededQuery: {},
    moduleName,
    isEditorReady: false,
  };

  return create(
    zustandDevTools(
      (set, get) => ({
        ...initialState,
        actions: {
          setCurrentState: (currentState) => {
            set({ ...currentState }, false, { type: 'SET_CURRENT_STATE', currentState });
          },
          setErrors: (error) => {
            set({ errors: { ...get().errors, ...error } }, false, { type: 'SET_ERRORS', error });
          },
          setEditorReady: (isEditorReady) => set({ isEditorReady }),
        },
      }),
      { name: 'Current State' }
    )
  );
}

export const useCurrentStateStore = (callback, shallow) => {
  const moduleName = useContext(ModuleContext);

  if (!moduleName) throw Error('module context not available');

  const _useCurrentStateStore = useSuperStore((state) => state.modules[moduleName].useCurrentStateStore);

  return _useCurrentStateStore(callback, shallow);
};

export const useCurrentState = () =>
  // Omitting 'actions' here because we don't want to expose it to user
  useCurrentStateStore((state) => {
    return {
      queries: state.queries,
      components: state.components,
      globals: state.globals,
      errors: state.errors,
      variables: state.variables,
      client: state.client,
      server: state.server,
      page: state.page,
      succededQuery: state.succededQuery,
      constants: state.constants,
      layout: state.layout,
    };
  }, shallow);

useCurrentStateStore.subscribe((state) => {
  const moduleName = useContext(ModuleContext);
  const isEditorReady = state.isEditorReady;

  if (!isEditorReady) return;

  const isStoreIntialized = useSuperStore.getState().modules[moduleName].useResolveStore.getState().storeReady;

  if (!isStoreIntialized) {
    const isPageSwitched = useSuperStore.getState().modules[moduleName].useResolveStore.getState().isPageSwitched;

    handleLowPriorityWork(
      () => {
        useSuperStore.getState().modules[moduleName].useResolveStore.getState().actions.updateAppSuggestions({
          queries: state.queries,
          components: state.components,
          globals: state.globals,
          page: state.page,
          variables: state.variables,
          client: state.client,
          server: state.server,
          constants: state.constants,
        });
        useSuperStore.getState().modules[moduleName].useResolveStore.getState().actions.pageSwitched(false);
      },
      null,
      isPageSwitched
    );

    return useSuperStore
      .getState()
      .modules[moduleName].useResolveStore.getState()
      .actions.updateStoreState({ storeReady: true });
  }
}, shallow);

export const getCurrentState = (moduleName) => {
  return omit(useSuperStore.getState().modules[moduleName].getState(), 'actions');
};
