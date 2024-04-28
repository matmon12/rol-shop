import axios from "axios";


export const favoriteModule = {
  state: () => ({
    favoriteCount: 0
  }),
  mutations: {
    setFavoriteCount(state, favoriteCount) {
      state.favoriteCount = favoriteCount;
    }
  },
  actions: {
    async addToFavorite({ state, commit }, item) {
      try {
        if (!item.isFavorite) {
          const obj = {
            item_id: item.id,
            item: item
          }

          item.isFavorite = true;
          const { data } = await axios.post(`https://c2ff7a8de0a119c8.mokky.dev/favorites`, obj);
          item.favoriteId = data.id;

          commit('setFavoriteCount', state.favoriteCount + 1);

        } else {
          item.isFavorite = false;
          await axios.delete(`https://c2ff7a8de0a119c8.mokky.dev/favorites/${item.favoriteId}`);
          item.favoriteId = null;

          commit('setFavoriteCount', state.favoriteCount == 0 ? state.favoriteCount : state.favoriteCount - 1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  namespaced: true
}