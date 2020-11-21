import { AsyncActionCreatorBuilder, PayloadAction, getType } from "typesafe-actions";
import { AnyAction } from 'redux';
import {call, put} from 'redux-saga/effects';
import { Line, RuleQuery } from "../modules/rule/slice";

type PromiseCreatorFunction<P, T> =
  | ((payload: P) => Promise<T>)
  | (() => Promise<T>);

// parsedDocument:
// {
//   body: "hi",
//   body+title (includes , regex): ["hello"]
// }
// ruleQuery:
// [
//   {check: 'body', search: ['hi'], modifier: undefined, id: 0},
//   {check: 'body', search: ['hello'], modifier: ['includes', 'regex'], id:1}
//   {check: 'title', search: ['hello'], modifier: ['includes', 'regex'], id:1}
// ]

export const valueToLine = (value: string) => {
  let lines: Line[] = [];
  let ruleId = 0;
  let lineId = 0;
  value.split('\n').forEach((line, index) => {
    if(line.includes(':')) {
      lines.push({content: line, lineId: lineId++, ruleId: ruleId, selected: false});
    }
    if(line.includes('---')) {
      if(index!==0){
        lineId=0;
        ruleId++;
      }
    }
  })
  return lines;
};

export const arrayToQuery = (parsedDocuments: object[]) => {
  return parsedDocuments.reduce(
    (ruleQuerys: RuleQuery[], parsedDocument, ruleIndex) => {
      const regexForKey = /^(~?[^\s(]+)\s*(?:\((.+)\))?$/;
      if (parsedDocument !== null) {
        for (const [lineIndex, [key, value]] of Object.entries(
          Object.entries(parsedDocument),
        )) {
          const result = key.match(regexForKey);
          //result[0]: body+title, result[1]: "undefined" | includes, regex
          if (result != null) {
            const isNot = result[1].startsWith('~');
            const modifierArray =
              result[2] === undefined ? [] : String(result[2]).split(/\s*,\s*/);
            if (isNot) {
              modifierArray.push('not');
            }
            const checkArray = String(
              isNot ? result[1].substring(1) : result[1],
            ).split(/\s*\+\s*/);
            const valueArray =
              typeof value === 'string' ? [value] : (value as string[]);
            checkArray.forEach((check) => {
              ruleQuerys.push({
                check,
                value: valueArray,
                modifier: modifierArray,
                lineId: parseInt(lineIndex),
                ruleId: ruleIndex,
              });
            });
          }
        }
      }
      return ruleQuerys;
    },
    [],
  );
};

function isPayloadAction<P>(action: any): action is PayloadAction<string, P> {
  return action.payload !== undefined;
}

export function createAsyncSaga<T1, P1, T2, P2, T3, P3>(
  asyncActionCreator: AsyncActionCreatorBuilder<
    [T1, [P1, undefined]],
    [T2, [P2, undefined]],
    [T3, [P3, undefined]]
  >,
  promiseCreator: PromiseCreatorFunction<P1, P2>
) {
  return function* saga(action: ReturnType<typeof asyncActionCreator.request>) {
    try {
      const result = isPayloadAction<P1>(action)
      ? yield call (promiseCreator, action.payload)
      : yield call (promiseCreator);
      yield put(asyncActionCreator.success(result));
    } catch (e) {
      yield put(asyncActionCreator.failure(e));
    }
  }
};

export type AsyncState<T, E = any> = {
  data: T | null;
  loading: boolean;
  error: E | null;
};

export const asyncState = {
  initial: <T, E = any>(initialData?: T): AsyncState<T, E> => ({
    loading: false,
    data: initialData || null,
    error: null,
  }),
  load: <T, E = any>(data?: T): AsyncState<T, E> => ({
    loading: true,
    data: data || null,
    error: null,
  }),
  success: <T, E = any>(data: T): AsyncState<T, E> => ({
    loading: false,
    data,
    error: null,
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    loading: false,
    data: null,
    error: error,
  }),
};

type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;

export function createAsyncReducer<
  S,
  AC extends AnyAsyncActionCreator,
  K extends keyof S
>(asyncActionCreator: AC, key: K) {
  return (state: S, action: AnyAction) => {
    const [request, success, failure] = [
      asyncActionCreator.request,
      asyncActionCreator.success,
      asyncActionCreator.failure,
    ].map(getType);
    switch (action.type) {
      case request:
        return {
          ...state,
          [key]: asyncState.load(),
        };
      case success: {
        return {
          ...state,
          [key]: asyncState.success(action.payload),
        };
      }
      case failure: {
        return {
          ...state,
          [key]: asyncState.error(action.payload),
        };
      }
      default:
        return state;
    }
  };
}

export function transformToArray<AC extends AnyAsyncActionCreator>(asyncActionCreator: AC) {
  const {request, success, failure} = asyncActionCreator;
  return [request, success, failure];
}