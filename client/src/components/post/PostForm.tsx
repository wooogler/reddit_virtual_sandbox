import React from 'react';
import { useFormik } from 'formik';
import Select, { OptionsType, Styles } from 'react-select';
import styled from 'styled-components';
import Button from '../common/Button';
import Textarea from 'react-textarea-autosize';
import CustomSelect from '../common/CustomSelect';

interface PostFormProps {
  onClickClose: () => void;
  list: string;
}

type OptionType = { value: string; label: string };

const typeOptions: OptionsType<OptionType> = [
  { value: 'submission', label: 'submission' },
  { value: 'comment', label: 'comment' },
];

function PostForm({ onClickClose, list }: PostFormProps) {

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
      <div className='title'>Add new posts to {list}</div> 
      <label htmlFor="type">Type</label>
      <CustomSelect
        className='select-type'
        options={typeOptions}
        onChange={(option) => {
          formik.setFieldValue('type', (option as OptionType).value);
        }}
      />
      {
        formik.values.type === 'submission' && 
        <>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        </>
      }
      
      <label htmlFor="author">Author</label>
      <input
        name="author"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.author}
      />
      <label htmlFor="body">Body</label>
      <Textarea
        name="body"
        onChange={formik.handleChange}
        value={formik.values.body}
        minRows={15}
      />
      <div className="buttons">
        <Button color="red" onClick={onClickClose}>
          Close
        </Button>
        <Button type="submit">Save</Button>
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
  }
  label {
    margin-left: 0.2rem;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
  input,
  textarea {
    font-size: 1rem;
    font-family: sans-serif;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    padding: 0.5rem;
  }
  .select-type {
    margin-bottom: 1rem;
  }
`;

export default PostForm;
