import db from '../db';
import sendEmail from '../send-email';
import _ from "underscore";
import conditionService from "../conditions/condition.service";
async function evaluate(lhsValue: any, operator: string, rhsValue: any, rhs: any) {
  let evaluation: any = false;
  if (operator === '==') {
    evaluation = lhsValue === rhsValue;
  } else if (operator === 'where') {
    if (rhsValue.length > 0) {
      evaluation = _.find(rhsValue, (record) => {
        return record.data[rhs.field] === lhsValue;
      });
    }
  }
  return evaluation;
}

async function evaluateRHS(rhs: {
  type: string,
  value: string,
  object: string,
  field: string,
  literal: string,
}, pool: any[]) {
  if (rhs.type === 'object') {
    return db.Record.find({ object: rhs.object })
  }
  if (rhs.type === 'literal') {
    return rhs.literal
  }
}

async function evaluateLHS(lhs: {
  object: string,
  type: string,
  value: string,
  variable: {
    name: string,
    object: string,
  }
  field: string,
}, pool: any) {
  const variable = _.find(pool, v => lhs.variable.name === v.name);
  console.log('variable: ', variable);
  if (lhs.variable.object === variable.object) {
    return variable.data[lhs.field];
  }
  return false;
}

async function runFilter(
  conditions: { statements: any[] },
  state: {
    pool: any,
    system: any,
  },
) {
  return conditionService.runCondition(conditions, state.pool, state.system)
}

export default {
  runFilter,
};
