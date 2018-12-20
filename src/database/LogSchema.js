const logSchema = {
  title: 'log schema',
  description: 'describes a log event',
  version: 0,
  type: 'object',
  properties: {
    eventId: {
      type: 'string',
      primary: true
    },
    severity: {
        type: 'string'
    },
    message: {
        type: 'string'
    },
    // description:{
    //     type:'string'
    // },
    // extraProperties: {
    //   type: 'array',
    //   maxItems: 5,
    //   uniqueItems: true,
    //   item: {
    //     type: 'object',
    //     properties: {
    //       name: {
    //         type: 'string'
    //       },
    //       employeeId: {
    //         type: 'string'
    //       }
    //     }
    //   }
    // }
  },
  required: ['eventId']
};

export default logSchema;