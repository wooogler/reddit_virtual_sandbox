import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Popconfirm } from 'antd';
import { Select, Checkbox } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import {
  postActions,
  postSelector,
  PostType,
  SortType,
  SpamSortType,
} from '../../modules/post/slice';
import { Button } from 'antd';
import DraggableModal from '../common/DraggableModal';
import PostForm from './PostForm';
import { getPostsRefresh, getSpamsRefresh } from '../../modules/post/actions';

export interface ListHeaderProps {
  list: 'unmoderated' | 'moderated';
  name: string;
  splitView: boolean;
  userImported: boolean;
  tooltipText?: string;
  span: boolean;
}

function ListHeader({
  list,
  name,
  splitView,
  tooltipText,
  userImported,
  span,
}: ListHeaderProps) {
  const dispatch = useDispatch();
  const loadingDelete = useSelector(postSelector.loadingDelete);
  const loadingSpamDelete = useSelector(postSelector.loadingSpamDelete);
  const { Option, OptGroup } = Select;
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleClickAddPost = () => {
    setIsAddOpen(true);
  };

  const handleClickDeleteAll = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.deleteAllPosts());
    } else {
      dispatch(postActions.deleteAllSpams());
    }
  };

  const handleClickCloseModal = () => {
    setIsAddOpen(false);
  };

  const handleChangeView = (type: PostType) => {
    if (list === 'unmoderated') {
      dispatch(postActions.changePostType(type));
      dispatch(getPostsRefresh());
    } else if (list === 'moderated') {
      dispatch(postActions.changeSpamType(type));
      dispatch(getSpamsRefresh());
    }
  };

  const handleChangeSort = (sort: SortType | SpamSortType) => {
    if (list === 'unmoderated') {
      dispatch(postActions.changeSortType(sort as SortType));
      dispatch(getPostsRefresh());
    } else if (list === 'moderated') {
      dispatch(postActions.changeSpamSortType(sort as SpamSortType));
      dispatch(getSpamsRefresh());
    }
  };

  const handleChangeSplitView = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.toggleSplitPostList());
      dispatch(getPostsRefresh());
    } else if (list === 'moderated') {
      dispatch(postActions.toggleSplitSpamPostList());
      dispatch(getSpamsRefresh());
    }
  };

  // const handleChangeUserImported = () => {
  //   if (list === 'unmoderated') {
  //     dispatch(postActions.togglePostUserImported());
  //     dispatch(getPostsRefresh());
  //   } else if (list === 'moderated') {
  //     dispatch(postActions.toggleSpamUserImported());
  //     dispatch(getSpamsRefresh());
  //   }
  // };

  const handleChangeSpanAll = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.togglePostSpan());
    } else if (list === 'moderated') {
      dispatch(postActions.toggleSpamSpan());
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center my-1">
        <div className="text-2xl mx-2">{name}</div>
        <Tooltip placement="right" title={tooltipText}>
          <InfoCircleOutlined />
        </Tooltip>
        <div className="flex ml-auto mr-2">
          <Popconfirm
            placement="bottom"
            title="Are you sure?"
            onConfirm={handleClickDeleteAll}
          >
            <Button
              danger
              size="small"
              loading={
                list === 'unmoderated' ? loadingDelete : loadingSpamDelete
              }
            >
              Delete all
            </Button>
          </Popconfirm>
          <Button
            className="ml-1"
            type="primary"
            size="small"
            onClick={handleClickAddPost}
          >
            Add test post
          </Button>
        </div>

        <DraggableModal
          visible={isAddOpen}
          setVisible={setIsAddOpen}
          title={'Add a new post'}
        >
          <PostForm onClickClose={handleClickCloseModal} list={list} />
        </DraggableModal>
      </div>
      <div className="flex flex-wrap mb-2">
        <div>
          <Select
            defaultValue="all"
            onChange={handleChangeView}
            size="small"
            className="mr-1 w-28"
          >
            <Option value="all">All Posts</Option>
            <Option value="submission">Submission</Option>
            <Option value="comment">Comment</Option>
          </Select>
          {list === 'unmoderated' ? (
            <Select
              onChange={handleChangeSort}
              placeholder="sort"
              size="small"
              className="w-28 mr-2"
            >
              <Option value="new">New</Option>
              <Option value="old">Old</Option>
              <Option value="votes_desc">more votes</Option>
              <Option value="votes_asc">less votes</Option>
              <Option value="fpfn">FP & FN</Option>
            </Select>
          ) : (
            <Select
              onChange={handleChangeSort}
              placeholder="sort"
              size="small"
              className="w-24 mr-2"
            >
              <OptGroup label="created by">
                <Option value="created-new">New</Option>
                <Option value="created-old">Old</Option>
              </OptGroup>
              <OptGroup label="banned by">
                <Option value="banned-new">New</Option>
                <Option value="banned-old">Old</Option>
              </OptGroup>
            </Select>
          )}
        </div>
        <div>
          {/* <Checkbox onChange={handleChangeUserImported} checked={userImported}>
            User Imported
          </Checkbox> */}
          <Checkbox onChange={handleChangeSplitView} checked={splitView}>
            Filtered Only
          </Checkbox>
          <Checkbox onChange={handleChangeSpanAll} checked={span}>
            Span All
          </Checkbox>
        </div>
      </div>
    </>
  );
}

export default ListHeader;
