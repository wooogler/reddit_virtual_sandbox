import React from 'react';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { Button, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import { AppDispatch } from '../..';
import {
  addPost,
  addSpam,
  getPostsRefresh,
  getSpamsRefresh,
} from '../../modules/post/actions';
import { NewPost } from '../../lib/api/modsandbox/post';

interface PostFormProps {
  onClickClose: () => void;
  list: 'unmoderated' | 'moderated';
}

function PostForm({ onClickClose, list }: PostFormProps) {
  const dispatch: AppDispatch = useDispatch();
  const { Option } = Select;
  const { TextArea } = Input;
  const username = useSelector((state: RootState) => state.user.me?.username);

  const formik = useFormik<NewPost>({
    initialValues: {
      _id: Math.random().toString(36).substr(2, 7),
      _type: 'submission',
      title: '',
      body: '',
      author: username,
    },
    onSubmit: async (values) => {
      if (list === 'unmoderated') {
        await dispatch(addPost(values));
        await dispatch(getPostsRefresh());
      } else if (list === 'moderated') {
        await dispatch(
          addSpam({
            ...values,
            _type:
              values._type === 'submission'
                ? 'spam_submission'
                : 'spam_comment',
          }),
        );
        await dispatch(getSpamsRefresh());
      }
      onClickClose();
    },
  });
  return (
    <PostFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">
        {list === 'unmoderated'
          ? 'Add a new post to Posts'
          : 'Add a new spam to Seed posts'}
      </div>
      <label htmlFor="type">Type</label>
      <Select
        className="select-type"
        onChange={(value) => {
          formik.setFieldValue('_type', value);
        }}
        defaultValue="submission"
        style={{ fontSize: '1rem' }}
      >
        <Option value="submission">submission</Option>
        <Option value="comment">comment</Option>
      </Select>
      <label htmlFor="author">Post ID</label>
      <Input
        name="author"
        type="text"
        onChange={formik.handleChange}
        value={formik.values._id}
      />
      {formik.values._type === 'submission' && (
        <>
          <label htmlFor="title">Title</label>
          <Input
            name="title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
        </>
      )}

      <label htmlFor="author">Author</label>
      <Input
        name="author"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.author}
      />
      <label htmlFor="body">Body</label>
      <TextArea
        name="body"
        onChange={formik.handleChange}
        value={formik.values.body}
        autoSize={{ minRows: 6, maxRows: 10 }}
      />
      <div className="buttons">
        <Button onClick={onClickClose}>Close</Button>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </div>
    </PostFormDiv>
  );
}

const PostFormDiv = styled.form`
  display: flex;
  flex-direction: column;
  margin: 20px;
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  .buttons {
    display: flex;
    margin-left: auto;
    button {
      margin-left: 1rem;
    }
  }
  label {
    margin-left: 0.2rem;
    margin-bottom: 0.2rem;
    font-size: 1rem;
  }
  input,
  textarea {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .select-type {
    margin-bottom: 1rem;
  }
`;

export default PostForm;
