export const orderModule = {
  state: () => ({
    orderNumber: 0,
  }),
  mutations: {
    setOrderNumber(state, orderNumber) {
      state.orderNumber = orderNumber;
    }
  },
  namespaced: true,
};