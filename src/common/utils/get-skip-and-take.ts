export const GetSkipAndPage = (page?: number, limit?: number) => {
  return page && page > 0 && limit && limit > 0
    ? {
        take: limit,
        skip: (page - 1) * limit,
      }
    : {
        take: 1000000,
        skip: 0,
      };
};
