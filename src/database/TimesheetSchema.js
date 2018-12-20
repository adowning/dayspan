const timesheetSchema = {
  title: 'timesheet schema',
  description: 'describes a timesheet',
  version: 0,
  type: 'object',
  properties: {
    employeeId: {
      type: 'string',
      primary: true
    },
    status: {
      type: 'number'
    },
    humanityId: {
      type: 'number'
    },
    startTime: {
      type: 'string'
    },
    endTime: {
      type: 'string'
    }
  },
  required: ['employeeId', 'humanityId', 'startTime']
}

export default timesheetSchema
