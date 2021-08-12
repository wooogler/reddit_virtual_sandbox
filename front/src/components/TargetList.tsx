import { IPost } from '@typings/db';
import { AutoModStat, Condition } from '@typings/types';
import { useStore } from '@utils/store';
import { isFiltered } from '@utils/util';
import { Button, Checkbox, Empty } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ReactElement, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import AddPostModal from './AddPostModal';
import BarRateHorizontal from './BarRateHorizontal';
import OverlayLoading from './OverlayLoading';
import PanelName from './PanelName';
import PostItem from './PostItem';

interface Props {
  label: string;
  onSubmit?: (postId: string) => void;
  isLoading?: boolean;
  posts?: IPost[];
  place?: 'target' | 'except';
  totalTarget?: number;
}

function TargetList({
  label,
  onSubmit,
  isLoading,
  posts,
  place,
  totalTarget,
}: Props): ReactElement {
  // const [urlStatus, setUrlStatus] = useState<any>('');
  // const [urlHelp, setUrlHelp] = useState<any>('');
  // const [visible, setVisible] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const { rule_id, check_id, config_id, line_id } = useStore();
  const { condition } = useParams<{ condition: Condition }>();
  const [form] = useForm();
  const onClickAdd = useCallback(() => {
    // setVisible((prev) => !prev);
    setOpenAddModal(true);
    form.resetFields();
  }, [form]);
  // const onSearch = (val: string) => {
  //   setUrlHelp('');
  //   setUrlStatus('');
  //   if (!isUrl(val)) {
  //     setUrlHelp('Please Input URL address');
  //     setUrlStatus('error');
  //     return;
  //   }
  //   const postUrl = new Url(val);
  //   if (postUrl.host !== 'www.reddit.com') {
  //     setUrlHelp('You can only use reddit url!');
  //     setUrlStatus('error');
  //     return;
  //   }
  //   const pathname = postUrl.pathname.split('/');
  //   const postId =
  //     pathname[6] === '' ? `t3_${pathname[4]}` : `t1_${pathname[6]}`;
  //   if (onSubmit) {
  //     onSubmit(postId);
  //   }
  //   setVisible(false);
  // };

  const onCancel = () => {
    setOpenAddModal(false);
  };

  const stat: AutoModStat = {
    part: posts
      ? posts?.filter((post) =>
          isFiltered(post, config_id, rule_id, line_id, check_id)
        ).length
      : 0,
    total: totalTarget ?? (posts ? posts.length : 0),
  };

  const [viewOnly, setViewOnly] = useState(false);

  return (
    <div className='relative flex flex-col h-full p-2 w-1/2 overflow-y-auto'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex items-center flex-wrap'>
        <PanelName>{label}</PanelName>
        <div className='text-sm text-gray-400'>
          {condition === 'modsandbox' ? (
            <BarRateHorizontal
              part={stat.part}
              total={stat.total}
              place={
                place === 'target'
                  ? 'Posts that should be filtered'
                  : 'Posts to avoid being filtered'
              }
            />
          ) : place === 'target' && condition === 'sandbox' ? (
            <BarRateHorizontal
              part={stat.part}
              total={stat.total}
              place='Posts on subreddit'
            />
          ) : (
            `${posts ? posts.length : 0} Posts`
          )}
        </div>

        {onSubmit && place && (
          <>
            <div className='ml-auto flex items-center'>
              {/* <Progress percent={rate * 100} showInfo={false} /> */}

              {/* <Popover
                placement='bottom'
                title='Add Posts with URL'
                trigger='click'
                content={
                  <div className='flex flex-col items-center'>
                    <Form form={form}>
                      <Form.Item
                        name='url'
                        label='URL'
                        validateStatus={urlStatus}
                        help={urlHelp}
                      >
                        <Input.Search
                          enterButton='Add'
                          onSearch={onSearch}
                          placeholder='ex) https://www.reddit.com/r/cscareerquestions/...'
                        />
                      </Form.Item>
                    </Form>
                    <Button onClick={() => setOpenAddModal(true)}>
                      Add a custom post
                    </Button>
                  </div>
                }
                visible={visible}
                onVisibleChange={(visible) => setVisible(visible)}
              > */}
              {condition === 'modsandbox' && (
                <Checkbox
                  value={viewOnly}
                  onChange={() => setViewOnly((state) => !state)}
                >
                  {place === 'target' ? 'Non-filtered only' : 'filtered only'}
                </Checkbox>
              )}
              {condition !== 'modsandbox' && (
                <Button
                  size='small'
                  onClick={onClickAdd}
                  data-tour='create-post'
                >
                  Create Post
                </Button>
              )}

              {/* </Popover> */}
            </div>
            <AddPostModal
              visible={openAddModal}
              onCancel={onCancel}
              place={place}
            />
          </>
        )}
      </div>
      {posts?.length !== 0 ? (
        <div className='overflow-auto post-scroll'>
          {posts &&
            posts
              .filter((post) => {
                const isFilteredPost = isFiltered(
                  post,
                  config_id,
                  rule_id,
                  line_id,
                  check_id
                );
                if (viewOnly) {
                  if (place === 'target') {
                    return !isFilteredPost;
                  } else {
                    return isFilteredPost;
                  }
                }
                return true;
              })
              .map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  isFiltered={
                    condition !== 'baseline' || place === 'target'
                      ? isFiltered(post, config_id, rule_id, line_id, check_id)
                      : false
                  }
                  isTested={true}
                />
              ))}
        </div>
      ) : (
        <div className='flex flex-1 justify-center items-center'>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              condition === 'modsandbox'
                ? 'Add a post in your collection'
                : 'Empty'
            }
          />
        </div>
      )}
    </div>
  );
}

export default TargetList;
