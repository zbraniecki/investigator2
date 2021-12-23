/* function getShadowProp(obj1: Record<string, any>, obj2: Record<string, any>, key: string): any { */
/*   return obj1[key] === undefined ? obj2[key] : obj1[key]; */
/* } */

/* export function mergeHeaderData(initial: HeaderData, user: Partial<HeaderData>): HeaderData { */
/*   const result: Record<string, any> = {}; */
/*   for (const key of Object.keys(initial)) { */
/*     result[key] = getShadowProp(user, initial, key); */
/*   } */
/*   return result as HeaderData; */
/* } */
/* export function mergeTableInfo(initial: InitialTableState, user: TableState | undefined): TableInfo { */
/*   let result = { */
/*     name: initial.name, */
/*     sortColumns: Array.from(initial.sortColumns || []), */
/*     headers: mergeHeaderData(initial.headers, user?.headers), */
/*     nested: initial.nested || false, */
/*     filter: {}, */
/*   }; */
/*   return result; */
/* } */
