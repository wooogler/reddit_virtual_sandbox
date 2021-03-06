import request from '@utils/request';
import { useMutation } from 'react-query';

interface Props {
  task?: string;
  info?: string;
  content?: string;
  move_to?: string;
  post_id?: string;
  config_id?: number;
  rule_id?: number;
  line_id?: number;
  check_id?: number;
  condition? :string;
}

export default function useLogMutation() {
  return useMutation(
    ({
      task,
      info,
      content,
      move_to,
      post_id,
      config_id,
      rule_id,
      line_id,
      check_id,
      condition
    }: Props) =>
      request({
        url: '/log/',
        method: 'POST',
        data: {
          task,
          info,
          content,
          move_to,
          post_id,
          config_id,
          rule_id,
          line_id,
          check_id,
          condition,
        },
      })
  );
}
