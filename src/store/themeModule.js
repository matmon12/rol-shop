export const themeModule = {
  state: () => ({
    theme: false,
  }),
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    }
  },
  namespaced: true
}