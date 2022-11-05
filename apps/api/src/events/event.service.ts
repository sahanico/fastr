import _ from 'underscore';

import designService from '../designs/design.service';
import processService from '../processes/process.service';

async function createRecord(record: { object: any }) {
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
        // @ts-ignore
        await processService.runProcess(process);
      }
    }
  }
}

export default {
  createRecord,
};
