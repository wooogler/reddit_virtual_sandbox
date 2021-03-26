import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { Select, Checkbox, Input } from 'antd';
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
import { getPostsRefresh, getSpamsRefresh, importTestData } from '../../modules/post/actions';
import { RootState } from '../../modules';
import { AppDispatch } from '../..';

export interface ListHeaderProps {
  list: 'unmoderated' | 'moderated';
  name: string;
  splitView: boolean;
  userImported: boolean;
  tooltipText?: string;
  span: boolean;
}

const { Search } = Input;

function ListHeader({
  list,
  name,
  splitView,
  tooltipText,
  userImported,
  span,
}: ListHeaderProps) {
  const dispatch: AppDispatch = useDispatch();
  const postSortType = useSelector(postSelector.postSort);
  const spamSortType = useSelector(postSelector.spamSort);
  const { Option, OptGroup } = Select;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [importClick, setImportClick] = useState(true);
  const ruleEditorMode = useSelector((state: RootState) => state.rule.mode);
  const experiment = useSelector((state: RootState) => state.user.experiment);
  const search = useSelector(postSelector.postSearch);

  const handleClickAddPost = () => {
    setIsAddOpen(true);
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

  const handleSearchPost = (value: string) => {
    if (list === 'unmoderated') {
      dispatch(postActions.changePostSearch(value));
      dispatch(getPostsRefresh());
    }
  };

  const handleCancelPostSearch = () => {
    setPostSearch('');
    handleSearchPost('');
  };

  const handleClickImport = () => {
    dispatch(importTestData()).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    });
    setImportClick(false);
  };

  const [postSearch, setPostSearch] = useState('');

  return (
    <>
      <div className="flex flex-wrap items-center my-1">
        <div className="text-xl mx-2 font-display">{name}</div>
        <Tooltip placement="right" title={tooltipText}>
          <InfoCircleOutlined />
        </Tooltip>
        {list === 'unmoderated' ? (
          <div className="flex ml-auto mr-2">
            <Button
              className="ml-1"
              type="primary"
              size="small"
              onClick={handleClickAddPost}
              disabled={ruleEditorMode === 'edit'}
            >
              Add a test comment
            </Button>
          </div>
        ) : (
          <div className="flex ml-auto mr-2">
            <Button
              onClick={handleClickImport}
              type="primary"
              size="small"
              disabled={!importClick}
            >
              Import Posts
            </Button>
          </div>
        )}

        <DraggableModal
          visible={isAddOpen}
          setVisible={setIsAddOpen}
          title={'Add a test comment'}
        >
          <PostForm onClickClose={handleClickCloseModal} list={list} />
        </DraggableModal>
      </div>
      <div className="flex flex-wrap mb-2">
        <div className="mx-2">Sort by</div>
        <div>
          {/* <Select
            defaultValue="all"
            onChange={handleChangeView}
            size="small"
            className="mr-1 w-28"
          >
            <Option value="all">All Posts</Option>
            <Option value="submission">Submission</Option>
            <Option value="comment">Comment</Option>
          </Select> */}
          {list === 'unmoderated' ? (
            <Select
              onChange={handleChangeSort}
              placeholder="sort"
              size="small"
              className="w-28 mr-2"
              value={postSortType}
            >
              <Option value="new">New</Option>
              <Option value="old">Old</Option>
              <Option value="votes_desc">more votes</Option>
              <Option value="votes_asc">less votes</Option>
              {experiment === 'modsandbox' && (
                <>
                  <Option value="fpfn" disabled={!splitView}>
                    FP & FN
                  </Option>
                  <Option value="tptn" disabled={!splitView}>
                    TP & TN
                  </Option>
                </>
              )}
            </Select>
          ) : (
            <Select
              onChange={handleChangeSort}
              placeholder="sort"
              size="small"
              className="w-24 mr-2"
              value={spamSortType}
            >
              {/* <OptGroup label="created by"> */}
              <Option value="created-new">New</Option>
              <Option value="created-old">Old</Option>
              {/* </OptGroup> */}
              {/* <OptGroup label="banned by">
                <Option value="banned-new">New</Option>
                <Option value="banned-old">Old</Option>
              </OptGroup> */}
              {/* <Option value="fpfn" disabled={!splitView}>
                FP & FN
              </Option>
              <Option value="tptn" disabled={!splitView}>
                TP & TN
              </Option> */}
            </Select>
          )}
        </div>

        {list === 'unmoderated' && (
          <div className="flex ml-auto">
            <Search
              size="small"
              placeholder="Search keywords"
              onSearch={handleSearchPost}
              value={postSearch}
              onChange={(item) => setPostSearch(item.target.value)}
              // disabled={splitView}
            />
            {search !== '' && (
              <Button danger size="small" onClick={handleCancelPostSearch}>
                Cancel
              </Button>
            )}
          </div>
        )}

        <div>
          {/* <Checkbox onChange={handleChangeUserImported} checked={userImported}>
            User Imported
          </Checkbox> */}
          {/* {experiment !== 'baseline' && (
            <Checkbox onChange={handleChangeSplitView} checked={splitView}>
              Split into Filtered / not Filtered
            </Checkbox>
          )} */}

          {/* <Checkbox onChange={handleChangeSpanAll} checked={span}>
            Span All
          </Checkbox> */}
        </div>
      </div>
    </>
  );
}

export default ListHeader;
