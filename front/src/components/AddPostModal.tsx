import { IPost, IUser } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useFormik } from 'formik';
import React, { ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

interface Props {
  visible: boolean;
  onCancel: () => void;
  place: IPost['place'];
}

export type NewPost = Omit<
  IPost,
  | 'user'
  | 'matching_rules'
  | 'matching_checks'
  | 'matching_check_combinations'
  | 'id'
  | 'banned_by'
  | 'isFiltered'
  | 'matching_configs'
  | 'sim'
  | 'score'
>;

function AddPostModal({ visible, onCancel, place }: Props): ReactElement {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery<IUser | false>('me');
  const { order } = useStore();

  const addCustomPost = ({
    post_id,
    post_type,
    title,
    body,
    author,
    place,
    created_utc,
    url,
    source,
  }: NewPost) =>
    request({
      url: `/posts/${place}/`,
      method: 'POST',
      data: {
        post_id,
        post_type,
        title,
        body,
        author,
        place,
        created_utc,
        url,
        source,
      },
    });

  const sortFpFnMutation = useMutation(
    () =>
      request({
        url: `posts/fpfn/`,
        method: 'POST',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('filtered');
        queryClient.invalidateQueries('not filtered');
      },
      mutationKey: 'fpfn',
    }
  );

  const addCustomPostMutation = useMutation(addCustomPost, {
    onSuccess: (_, { place }) => {
      if (place === 'target') {
        queryClient.invalidateQueries('target');
        if (order === 'fpfn') {
          sortFpFnMutation.mutate();
        }
        onCancel();
      } else {
        queryClient.invalidateQueries('except');
        onCancel();
      }
    },
  });

  const formik = useFormik<NewPost>({
    initialValues: {
      post_id: 'ffffff',
      post_type: 'Submission',
      title: '',
      body: '',
      author: userData ? userData.username : 'fake_user',
      place,
      created_utc: new Date(),
      url: 'self.modsandbox',
      source: 'Subreddit',
    },
    onSubmit: (values) => {
      addCustomPostMutation.mutate(values);
    },
  });
  const { Option } = Select;
  return (
    <Modal
      title='Add a Custom Post'
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      centered
      destroyOnClose
      onOk={() => {
        formik.handleSubmit();
      }}
      okButtonProps={{ loading: addCustomPostMutation.isLoading }}
      zIndex={2000}
    >
      <Form labelCol={{ span: 4 }}>
        {/* <Form.Item
          label='Post Type'
          name='post_type'
          initialValue={formik.values.post_type}
        >
          <Select
            value={formik.values.post_type}
            onChange={(value) => formik.setFieldValue('post_type', value)}
          >
            <Option value='Submission'>Submission</Option>
            <Option value='Comment'>Comment</Option>
          </Select>
        </Form.Item> */}
        {formik.values.post_type === 'Submission' && (
          <Form.Item
            label='Title'
            name='title'
            initialValue={formik.values.title}
          >
            <Input
              onChange={(value) =>
                formik.setFieldValue('title', value.target.value)
              }
            />
          </Form.Item>
        )}
        <Form.Item
          label='Author'
          name='author'
          initialValue={formik.values.author}
        >
          <Input
            value={formik.values.author}
            onChange={(value) =>
              formik.setFieldValue('author', value.target.value)
            }
          />
        </Form.Item>
        <Form.Item
          label='Content'
          name='body'
          initialValue={formik.values.body}
        >
          <TextArea
            onChange={(value) =>
              formik.setFieldValue('body', value.target.value)
            }
            rows={15}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddPostModal;
