export const dateModule = {
  state: () => ({
    // formattedDate: [],
  }),
  mutations: {
    setFormattedDate(state, formattedDate) {
      state.formattedDate = formattedDate;
    },
  },
  actions: {
    dateFormat({ state, commit }, { dayDate, yearDate, timeDate }) {
      const [day, month] = dayDate.split(".");
      const [hours, minutes] = timeDate.split(":");
      const date = new Date(yearDate, month - 1, day, hours, minutes);
      const formattedTime = date.toLocaleTimeString("ru-RU", {
        hour: "numeric",
        minute: "2-digit",
      });
      const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];
      const formattedDate = [
        `${date.getDate()} ${months[date.getMonth()]}`,
        `${formattedTime}`,
      ];

      return formattedDate;
    },
  },
  namespaced: true,
};
