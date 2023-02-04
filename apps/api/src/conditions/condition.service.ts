import db from '../db';
import sendEmail from '../send-email';
import _ from "underscore";
async function evaluate(lhsValue: any, operator: string, rhsValue: any, rhs: any, lhs: any) {
  let evaluation: any = false;
  if (operator === '==') {
    if (_.isArray(rhsValue)) {
      const val = _.filter(rhsValue, item => item.data[rhs.field] == lhsValue);
      console.log('eval val: ', val);
      if (val.length < 1) return false;
      return val[0];
    }
    if (_.isArray(lhsValue)) {
      // return the array items that matter
      return _.filter(lhsValue, item => item.data[lhs.field] == rhsValue)
    } else {
      evaluation = lhsValue === rhsValue;
    }
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
  systemField: string
}, pool: any[], system: any = {}) {
  if (rhs.type === 'object') {
    return db.Record.find({ object: rhs.object })
  }
  if (rhs.type === 'literal') {
    return rhs.literal
  }
  if (rhs.type === 'system') {
    if (rhs.systemField === 'logged_in_account') {
      return system.account.id;
    }
  }
  if ( rhs.type === 'input') {
    const input = _.findWhere(pool, { type: 'input' });
    return input.data[rhs.field];
  }
}

async function evaluateLHS (lhs: {
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
  if (lhs.variable.object === variable.object) {
    if (_.isArray(variable.data)) {
      return variable.data;
    } else {
      return variable.data[lhs.field]
    }
  }
  return false;
}

async function runCondition(
  conditions: { statements: any[] },
  pool: any = [],
  system: any = {},
) {
  const { lhs, operator, rhs } = conditions.statements[0];

  let lhsValue = await evaluateLHS(lhs, pool);
  let rhsValue = await evaluateRHS(rhs, pool, system);
  const evalu = await evaluate(lhsValue, operator, rhsValue, rhs, lhs);
  console.log('eval: ', evalu);
  return evalu;
}

export default {
  runCondition,
};
