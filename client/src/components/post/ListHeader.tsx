import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Popconfirm } from 'antd';
import styled from 'styled-components';
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
import palette from '../../lib/styles/palette';
import { commonActions } from '../../modules/common/slice';

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
  const count = useSelector(postSelector.count);
  const { Option, OptGroup } = Select;
  const [isAddOpen, setIsAddOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if(list === 'unmoderated') {
      const height = headerRef.current?.offsetHeight;
      if (height) {
        dispatch(commonActions.changePostListHeaderHeight(height));
      }
    }
    else if(list==='moderated') {
      const height = headerRef.current?.offsetHeight;
      if (height) {
        dispatch(commonActions.changeSpamListHeaderHeight(height));
      }
    }
  }, [dispatch, list])

  useLayoutEffect(() => {
    let resizetimer: NodeJS.Timeout
    const updateHeight = () => {
      if(list === 'unmoderated') {
        const height = headerRef.current?.offsetHeight;
        if (height) {
          clearTimeout(resizetimer);
          resizetimer = setTimeout(() => {
            dispatch(commonActions.changePostListHeaderHeight(height));
            console.log(height);
          }, 250);
        }
      }
      else if(list==='moderated') {
        const height = headerRef.current?.offsetHeight;
        if (height) {
          clearTimeout(resizetimer);
          resizetimer = setTimeout(() => {
            dispatch(commonActions.changeSpamListHeaderHeight(height));
            console.log(height);
          }, 250);
        }
      }
    };
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [dispatch, list]);

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

  const handleChangeUserImported = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.togglePostUserImported());
      dispatch(getPostsRefresh());
    } else if (list === 'moderated') {
      dispatch(postActions.toggleSpamUserImported());
      dispatch(getSpamsRefresh());
    }
  };

  const handleChangeSpanAll = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.togglePostSpan());
    } else if (list === 'moderated') {
      dispatch(postActions.toggleSpamSpan());
    }
  };

  return (
    <ListHeaderDiv ref={headerRef}>
      <div className="list-info">
        <div className="name">{name}</div>
        <Tooltip placement="right" title={tooltipText}>
          <InfoCircleOutlined />
        </Tooltip>
        <div className="stat">
          {list === 'unmoderated' ? (
            <div>
              filtered: {count.posts.filtered} / all: {count.posts.all} (
              {((count.posts.filtered / count.posts.all) * 100).toFixed(1)}%)
            </div>
          ) : (
            <div>
              filtered: {count.spams.filtered} / all: {count.spams.all} (
              {((count.spams.filtered / count.spams.all) * 100).toFixed(1)}%)
            </div>
          )}
        </div>

        <div className="button-group">
          <Popconfirm
            placement="bottom"
            title="Are you sure?"
            onConfirm={handleClickDeleteAll}
          >
            <Button
              danger
              size="small"
              loading={list === 'unmoderated' ? loadingDelete : loadingSpamDelete}
            >
              Delete All
            </Button>
          </Popconfirm>
          <Button type="primary" size="small" onClick={handleClickAddPost}>
            Add {list === 'unmoderated' ? 'post' : 'spam'}
          </Button>
        </div>

        <DraggableModal
          isOpen={isAddOpen}
          position={{ x: 800, y: 150 }}
          handleText={`Add a new ${list === 'unmoderated' ? 'post' : 'spam'}`}
        >
          <PostForm onClickClose={handleClickCloseModal} list={list} />
        </DraggableModal>
      </div>
      <div className="option-group">
        <div className="select-group">
          <Select
            defaultValue="all"
            onChange={handleChangeView}
            size="small"
            className="select-view"
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
              className="select-sort"
            >
              <Option value="new">New</Option>
              <Option value="old">Old</Option>
            </Select>
          ) : (
            <Select
              onChange={handleChangeSort}
              placeholder="sort"
              size="small"
              className="select-sort"
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
        <div className="checkbox-group">
          <Checkbox onChange={handleChangeUserImported} checked={userImported}>
            User Imported
          </Checkbox>
          <Checkbox onChange={handleChangeSplitView} checked={splitView}>
            Split View
          </Checkbox>
          <Checkbox onChange={handleChangeSpanAll} checked={span}>
            Span All
          </Checkbox>
        </div>
      </div>
    </ListHeaderDiv>
  );
}

const ListHeaderDiv = styled.div`
  padding: 0.2rem;
  .list-info {
    display: flex;
    width: 100%;
    align-items: center;
    .name {
      font-size: 1.5rem;
      margin: 0.3rem;
    }
    .button-group {
      margin-left: auto;
      button {
        margin-left: 0.5rem;
      }
    }
    svg {
      margin-left: 0.2rem;
    }
    .stat {
      margin-left: 0.5rem;
      font-size: 0.9rem;
      color: ${palette.gray[8]};
    }
  }
  .option-group {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    .select-group {
      display: flex;
      align-items: center;
      .select-sort {
        width: 5rem;
        margin-left: 0.5rem;
      }
      .select-view {
        width: 7rem;
        margin-left: 0.5rem;
      }
    }
    .checkbox-group {
      display: flex;
      margin: 0.2rem;
      span {
        padding: 0.1rem;
      }
      .ant-checkbox-wrapper {
        margin-left: 0.2rem;
      }
    }
  }
`;

export default ListHeader;
