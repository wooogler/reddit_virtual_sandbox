import React from 'react';
import {useFormik} from 'formik';
import styled from 'styled-components';
import Button from '../common/Button';
import Textarea from 'react-textarea-autosize';

interface PostFormProps {
  onClickClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

function PostForm({onClickClose}: PostFormProps) {
  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
      author: 'fake_user',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  })
  return (
    <PostFormDiv onSubmit={formik.handleSubmit}>
      <label htmlFor='title'>Title</label>
      <input name='title' type='text' onChange={formik.handleChange} value={formik.values.title} />
      <label htmlFor='title'>Author</label>
      <input name='author' type='text' onChange={formik.handleChange} value={formik.values.author} />
      <label htmlFor='body'>Body</label>
      <Textarea name='body' onChange={formik.handleChange} value={formik.values.body} minRows={10}/>
      <div className='buttons'>
        <Button color='red' onClick={onClickClose}>Close</Button>
        <Button type='submit'>Save</Button>
      </div>
    </PostFormDiv>
  )
}

const PostFormDiv = styled.form`
  display: flex;
  flex-direction: column;
  margin: 20px;
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
  input, textarea {
    font-size: 1.0rem;
    font-family: sans-serif;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    padding: 1rem;
  }
`

export default PostForm
