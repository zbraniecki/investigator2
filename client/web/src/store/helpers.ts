export function setFetchEntitiesReducer(
  builder: any,
  thunk: any,
  name: string,
  transform?: (payload: any) => void,
  extra?: (state: any, action: any) => void
) {
  builder.addCase(thunk.fulfilled, (state: any, action: any) => {
    if (action.payload !== null) {
      state[name] = {};
      for (const item of action.payload) {
        if (transform) {
          transform(item);
        }
        state[name][item.pk] = item;
      }
    }
    if (extra) {
      extra(state, action);
    }
  });
}
