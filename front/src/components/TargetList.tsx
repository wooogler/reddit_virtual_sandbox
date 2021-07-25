import { IPost } from '@typings/db';
import { AutoModStat, Condition } from '@typings/types';
import { useStore } from '@utils/store';
import { isFiltered } from '@utils/util';
import { Button, Empty } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ReactElement, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import AddPostModal from './AddPostModal';
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
  const { rule_id, check_combination_id, check_id, config_id } = useStore();
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
          isFiltered(post, config_id, rule_id, check_combination_id, check_id)
        ).length
      : 0,
    total: totalTarget ?? (posts ? posts.length : 0),
  };
  const rate = stat.total === 0 ? 0 : stat.part / stat.total;

  return (
    <div className='relative flex flex-col h-full p-2 w-1/2 overflow-y-auto'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex items-center flex-wrap'>
        <PanelName>{label}</PanelName>
        <div className='text-sm text-gray-400'>
          {condition === 'modsandbox'
            ? `(${stat.part}/${stat.total}) ${(rate * 100).toFixed(2)} %`
            : condition === 'sandbox'
            ? `${posts ? posts.length : 0} Posts`
            : `${stat.total} Posts`}
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
              <Button size='small' onClick={onClickAdd} data-tour='create-post'>
                Create Post
              </Button>
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
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                isFiltered={isFiltered(
                  post,
                  config_id,
                  rule_id,
                  check_combination_id,
                  check_id
                )}
                isTested={true}
              />
            ))}
        </div>
      ) : (
        <div className='flex flex-1 justify-center items-center'>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              condition !== 'baseline'
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
