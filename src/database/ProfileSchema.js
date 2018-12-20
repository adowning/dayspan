const profileSchema = {
  title: 'profile schema',
  description: 'describes an employee profile',
  version: 0,
  type: 'object',
  properties: {
    employeeId: {
      type: 'string',
      primary: true
    },
    humanityId: {
      type: 'string'
    },
    name: {
      type: 'object',
      properties: {
        first: {
          type: 'string'
        },
        middle: {
          type: 'string'
        },
        last: {
          type: 'string'
        }
      }
    },
    imageUrl: {
      type: 'string'
    }
    // email: {
    //   type: 'string'
    // },
    // birthday: {
    //   type: 'string'
    // },
    // phone: {
    //   type: 'string'
    // },
    // custom: {
    //   type: 'array',
    //   maxItems: 5,
    //   uniqueItems: true,
    //   item: {
    //     type: 'object',
    //     properties: {
    //       name: {
    //         type: 'string'
    //       },
    //       value: {
    //         type: 'string'
    //       }
    //     }
    //   }
    // }
  },
  required: ['employeeId', 'humanityId']
}
export default profileSchema
