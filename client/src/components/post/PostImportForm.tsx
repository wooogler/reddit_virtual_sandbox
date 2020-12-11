import React from 'react';
import {
  DatePicker,
  Input,
  Select,
  InputNumber,
  Button as AntdButton,
} from 'antd';
import 'antd/dist/antd.css';
import { useFormik } from 'formik';
import moment from 'moment';
import Button from '../common/Button';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAllPosts,
  importSubredditPosts,
  postSelector,
} from '../../modules/post/slice';
export interface PostImportFormProps {
  onClickClose: () => void;
}

function PostImportForm({ onClickClose }: PostImportFormProps) {
  const dispatch = useDispatch();
  const loadingDeleteAll = useSelector(postSelector.loadingDeleteAll);
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  const handleDeleteAll = () => {
    dispatch(deleteAllPosts());
  };
  const formik = useFormik({
    initialValues: {
      datetime: [
        moment()
          .subtract(2, 'hours')
          .startOf('hour')
          .format('YYYY-MM-DD HH:mm:ss'),
        moment()
          .subtract(1, 'hours')
          .startOf('hour')
          .format('YYYY-MM-DD HH:mm:ss'),
      ],
      subreddit: '',
      type: 'all',
      max_size: null,
    },
    onSubmit: (values) => {
      dispatch(
        importSubredditPosts({
          subreddit: values.subreddit,
          start_time: values.datetime[0],
          end_time: values.datetime[1],
          type: values.type,
          max_size: values.max_size,
        }),
      );
      onClickClose();
    },
  });
  return (
    <PostImportFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Import Subreddits</div>
      <label htmlFor="subreddit">Subreddit name</label>
      <Input
        size="large"
        placeholder="ex) AskReddit"
        name="subreddit"
        onChange={formik.handleChange}
      />
      <label>Post Type</label>
      <Select
        size="large"
        defaultValue="all"
        onChange={(value) => {
          formik.setFieldValue('type', value);
        }}
        value={formik.values.type}
      >
        <Option value="all">All Posts</Option>
        <Option value="submission">Submission</Option>
        <Option value="comment">Comment</Option>
      </Select>
      <label htmlFor="range">Datetime range</label>
      <RangePicker
        name="range"
        className="range-picker"
        showTime
        onChange={(values, formatString) =>
          formik.setFieldValue('datetime', formatString)
        }
        size="large"
        defaultValue={[
          moment().subtract(2, 'hours').startOf('hour'),
          moment().subtract(1, 'hours').startOf('hour'),
        ]}
      />
      <label htmlFor="max_size">Number of posts</label>
      <InputNumber
        style={{ width: '100%' }}
        name="max_size"
        size="large"
        placeholder="If number, the end datetime is ignored"
        onChange={(value) => {
          formik.setFieldValue('max_size', value);
        }}
      />
      <label>Delete All Posts</label>
      <AntdButton danger loading={loadingDeleteAll} onClick={handleDeleteAll}>
        Delete all posts
      </AntdButton>
      <div className="buttons">
        <Button color="red" onClick={onClickClose}>
          Close
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </PostImportFormDiv>
  );
}

const PostImportFormDiv = styled.form`
  display: flex;
  flex-direction: column;
  margin: 20px;
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  label {
    margin-left: 0.2rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .buttons {
    display: flex;
    margin-left: auto;
    margin-top: 1rem;
  }
`;

export default PostImportForm;
