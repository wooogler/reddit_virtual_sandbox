import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Rule = {
  id: number;
  title: string;
  value: string;
}

export type RuleState = {
  rules: {
    data: Rule[]
  }
}

export const initialState: RuleState = {
  rules: {
    data: [{
      title: 'rule1.yml',
      value: '',
      id: 0,
    }]
  }
}

let nextId = 1;

const ruleSlice = createSlice({
  name: 'rule',
  initialState,
  reducers: {
    addRule: (state, action: PayloadAction<Rule>) => {
      action.payload.id = nextId++;
      state.rules.data.push(action.payload);
    },
    closeRule: (state, action: PayloadAction<number>) => {
      const index = state.rules.data.findIndex(rule => rule.id === action.payload);
      state.rules.data.splice(index, 1);
    }
  }
})

