const paths = {
  home() {
    return '/';
  },
  reportShow(id: string) {
    return `/reports/${id}`;
  },
  reportCreate(id: string) {
    return `/reports/create`;
  },
};

export default paths;
