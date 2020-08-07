import { axios } from '@choerodon/boot';
import { getProjectId } from '@/utils/common';
import { IStatus } from '@/common/types';

export interface IStatusCirculation extends IStatus {
  to: string[];
  default?: boolean
  [propName: string]: any
}

class StatusTransformApi {
  get prefix() {
    return `/agile/v1/projects/${getProjectId()}`;
  }

  loadList(issueTypeId: string) {
    return axios({
      method: 'get',
      url: `${this.prefix}/status_transform/list`,
      params: {
        applyType: 'agile',
        issueTypeId,
      },
    });
  }
}

const statusTransformApi = new StatusTransformApi();
export { statusTransformApi };
