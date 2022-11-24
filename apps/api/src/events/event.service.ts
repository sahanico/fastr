import _ from 'underscore';

import designService from '../designs/design.service';
import processService from '../processes/process.service';

async function postCreateRecord(record: { object: any, data: any }) {
  const events = await designService.getDesignsByType({ type: 'event' });
  const filteredEvents: any[] = [];
  _.each(events, (event) => {
    if (
      event.meta.object === record.object &&
      event.meta.type === 'Create Record'
    ) {
      filteredEvents.push(event);
    }
  });
  for (let i = 0; i < filteredEvents.length; i++) {
    const event = filteredEvents[i];
    if (event.meta.process) {
      const process = await processService.getProcessByName(event.meta.process);
      if (process) {
        // find the input of same object as record
        // @ts-ignore
        // put the data in the pool as an input
        let { pool } = process.meta;
        pool = _.map(pool, (variable) => {
          if (variable.feeder === 'input') {
            if (variable.object === record.object) {
              return {
                ...variable,
                data: record.data
              }
            }
          }
          return variable;
        });
        await processService.runProcess(process, pool);
      }
    }
  }
  return true;
}

export default {
  postCreateRecord,
};
