export const crumbsModule = {
  state: () => ({
    paths: '',
  }),
  mutations: {
    setPaths(state, paths) {
      state.paths = paths;
    }
  },
  namespaced: true
};
