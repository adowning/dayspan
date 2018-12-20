const employeeSchema = {
  title: 'log schema',
  description: 'describes a log event',
  version: 0,
  type: 'object',
  properties: {
    employeeId: {
      type: 'string',
      primary: true
    },
    startDate: {
      type: 'string'
    },
    humanityId: {
      type: 'string'
    }
  },
  required: ['employeeId']
}

export default employeeSchema
