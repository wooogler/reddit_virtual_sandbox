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
  addTestPost,
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
      _type: 'comment',
      title: '',
      body: '',
      author: username,
      domain: 'self.FakeSubreddit',
    },
    onSubmit: async (values) => {
      if (list === 'unmoderated') {
        await dispatch(addTestPost(values));
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
    <form onSubmit={formik.handleSubmit} className="flex flex-col">
      {/* <label htmlFor="type" className="text-lg mr-2">
          Type
        </label>
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
        </Select> */}
      <div>
        <label htmlFor="_id" className="text-lg mr-2">
          Comment ID
        </label>
        <Input
          name="_id"
          type="text"
          className="w-40"
          onChange={formik.handleChange}
          value={formik.values._id}
        />
      </div>

      {/* {formik.values._type === 'submission' && (
        <>
          <label htmlFor="title">Title</label>
          <Input
            name="title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
        </>
      )} */}

      <label htmlFor="author" className='text-base my-1'>Author</label>
      <Input
        name="author"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.author}
      />
      <label htmlFor="body" className='text-base my-1'>Body</label>
      <TextArea
        name="body"
        onChange={formik.handleChange}
        value={formik.values.body}
        autoSize={{ minRows: 6, maxRows: 10 }}
      />
      {/* <label htmlFor="url">link URL</label>
      <Input
        name="url"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.domain}
      /> */}
      <div className="flex mt-4">
        <Button onClick={onClickClose} className='mr-2 ml-auto'>Close</Button>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </div>
    </form>
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
