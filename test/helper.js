const GenerateSimpleTestData = () => {
  const customers = [
    {
      latitude: '52.986375',
      user_id: 12,
      name: 'Christina McArdle',
      longitude: '-6.043701',
    },
    {
      latitude: '53.74452',
      user_id: 29,
      name: 'Oliver Ahearn',
      longitude: '-7.11167',
    },
  ];
  return customers;
};

const GenerateErrorData = () => {
  const customers = [
    {
      key1: 1,
      key2: 'Random string',
    },
  ];
  return customers;
};

module.exports = {
  GenerateSimpleTestData,
  GenerateErrorData,
};
