export function setFetchEntitiesReducer(
  builder: any,
  thunk: any,
  name: string,
  extra?: (state: any) => void
) {
  builder.addCase(thunk.fulfilled, (state: any, action: any) => {
    state[name] = {};
    for (const item of action.payload) {
      state[name][item.pk] = item;
    }
    if (extra) {
      extra(state);
    }
  });
}
