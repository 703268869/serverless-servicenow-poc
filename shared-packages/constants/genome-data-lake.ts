type ReadonlySFTPUsers = {
  users: readonly string[];
};

export const SFTP_USERS: ReadonlySFTPUsers = {
  users: ['oracle-oic-sftp-user', 'bmc-solidify-sftp-user'],
};

export const DOMO_DATASETS: ReadonlyArray<{
  readonly id: string;
  readonly name: string;
  readonly paginated: boolean;
}> = [
  {
    id: '99c864bf-3016-4f4d-8810-6f49a127e390',
    name: 'c2-dataset',
    paginated: false,
  },
  {
    id: 'd963c22d-ee2e-43c6-9ecf-8611cc5baa67',
    name: 'u2-dataset',
    paginated: false,
  },
];
