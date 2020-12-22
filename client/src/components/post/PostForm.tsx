import React from 'react';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { Button, Input, Select } from 'antd';

interface PostFormProps {
  onClickClose: () => void;
  list: string;
}

function PostForm({ onClickClose, list }: PostFormProps) {
  const { Option } = Select;
  const { TextArea } = Input;

  const formik = useFormik({
    initialValues: {
      type: 'submission',
      title: '',
      body: '',
      author: 'fake_user',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      onClickClose();
    },
  });
  return (
    <PostFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Add new posts to {list}</div>
      <label htmlFor="type">Type</label>
      <Select
        className="select-type"
        onChange={(value) => {
          formik.setFieldValue('type', value);
        }}
        defaultValue="submission"
        style={{ fontSize: '1rem' }}
      >
        <Option value="submission">submission</Option>
        <Option value="comment">comment</Option>
      </Select>
      {formik.values.type === 'submission' && (
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
