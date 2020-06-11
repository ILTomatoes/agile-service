import React, {
  useState, useMemo, useEffect, useRef,
} from 'react';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';
import { Select, Button } from 'choerodon-ui/pro';
import { SearchMatcher } from 'choerodon-ui/pro/lib/select/Select';
import { debounce } from 'lodash';
import styles from './index.less';

const { Option } = Select;

function applyMiddleWares(data: any, middleWares: Array<Function>) {
  return middleWares.reduce((preData, middleWare) => middleWare(preData), data);
}
function noop(data: any) {
  return data;
}
export interface LoadConfig {
  filter?: string,
  page?: number
}
export type Request = ({ filter, page }: LoadConfig) => Promise<any>
export interface SelectConfig {
  name: string
  textField?: string
  valueField?: string
  render?: (item: any) => JSX.Element
  request: Request
  middleWare?: (item: any) => boolean,
  paging?: boolean
  props?: object
}

export default function useSelect(config: SelectConfig) {
  const [data, setData] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const textRef = useRef<string>('');
  const defaultRender = (item: any) => <Option value={item[valueField]}>{item[textField]}</Option>;
  const {
    textField = 'name',
    valueField = 'id',
    render = defaultRender,
    request,
    middleWare = noop,
    paging = true,
    props,
  } = config;
  // 不分页时，本地搜索
  const localSearch = !paging;
  const loadData = async ({ filter = textRef.current, page = 1 }: LoadConfig = {} as LoadConfig) => {
    const res = await request({ filter, page });
    batchedUpdates(() => {
      if (paging) {
        const { list, hasNextPage } = res;
        setData(page > 1 ? data.concat(list) : list);
        setPage(page);
        setCanLoadMore(hasNextPage);
      } else {
        setData(paging ? res.list : res);
      }
    });
  };
  const searchData = useMemo(() => debounce((filter: string) => {
    loadData({ filter });
  }, 500), []);
  useEffect(() => {
    loadData({ filter: '' });
  }, [config]);
  const handleLoadMore = () => {
    loadData({ page: currentPage + 1 });
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    textRef.current = value;
    if (!localSearch) {
      searchData(value);
    }
  };
  const filterOptions: SearchMatcher = ({
    record, text,
  }) => {
    // @ts-ignore
    const { meaning } = record.data;
    let name = '';
    // 一般情况，option的children是一个字符串
    if (typeof meaning === 'string') {
      name = meaning;
    } else {
      // 其他情况, children是一个元素,那么约定这个元素上的name属性进行搜索
      // eslint-disable-next-line prefer-destructuring
      name = meaning.props.name;
    }
    return name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
  };
  const selectProps = {
    searchable: true,
    onInput: handleInput,
    onClear: () => {
      textRef.current = '';
      searchData('');
    },
    // 弹出时自动请求
    onPopupHiddenChange: (hidden: boolean) => {
      if (hidden === false && textRef.current !== '' && paging) {
        textRef.current = '';
        searchData('');
      }
    },
    searchMatcher: paging ? () => true : filterOptions,
    children: applyMiddleWares(data, [middleWare]).map(render),
    // @ts-ignore
    onOption: ({ record }) => {
      if (record.data.value === 'useSelect-load-more') {
        return {
          className: styles.load_more,
        };
      }
      return {};
    },
    ...props,
  };
  if (canLoadMore) {
    selectProps.children.push(
      <Option value="useSelect-load-more" disabled className="test" style={{ padding: 0 }}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadMore();
          }}
          style={{ margin: '-4px -12px', width: 'calc(100% + 24px)' }}
        >
          加载更多
        </Button>
      </Option>,
    );
  }
  return selectProps;
}