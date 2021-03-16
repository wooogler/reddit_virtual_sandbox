import React, { useEffect, useState } from 'react';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';
import { PostType } from '../../modules/post/slice';
import { SpamType } from '../../lib/api/modsandbox/post';
import { RootState } from '../../modules';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { LinkOutlined } from '@ant-design/icons';
import { CollapseIcon, ExpandIcon } from '../../static/svg';
import styled from 'styled-components';
import { prependListener } from 'process';
import Linkify from 'linkifyjs/react';

export interface BodyTextProps {
  text: string;
  matchBody?: Index[];
  type: PostType | SpamType;
  url: string;
}

function LinkRenderer(props: { href: string; children: any }) {
  return (
    <a
      href={
        props.href.startsWith('/r/')
          ? 'https://www.reddit.com' + props.href
          : props.href
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
}

function BodyText({ text, matchBody, type, url }: BodyTextProps) {
  const span = useSelector((state: RootState) => {
    if (type === 'submission' || type === 'comment') {
      return state.post.posts.span;
    }
    return state.post.spams.span;
  });
  const experiment = useSelector((state: RootState) => state.user.experiment);
  useEffect(() => {
    setEllipsis(!span);
  }, [span]);
  const [ellipsis, setEllipsis] = useState(true);

  if (text === 'null') return null;

  const handleClickSpan = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setEllipsis((state) => !state);
    e.stopPropagation();
  };

  const linkProperties = {
    target: '_blank',
    rel: 'nofollow noopener noreferrer',
  };

  return (
    <>
      <BodyTextDiv className={'text-sm font-body ' + (ellipsis && 'truncate')}>
        {matchBody && matchBody.length !== 0 && experiment === 'modsandbox' ? (
          <InteractionText text={text} match={matchBody} />
        ) : (
          <ReactMarkdown
            source={text}
            renderers={{
              link: LinkRenderer,
              paragraph: (props) => (
                <Linkify options={{ target: '_blank' }}>
                  <p>{props.children}</p>
                </Linkify>
              ),
            }}
          />
        )}
      </BodyTextDiv>
      {/* <div className="flex items-center opacity-60">
        {text.length > 50 && (
          <button
            className="hover:bg-gray-200 p-1 flex w-7"
            onClick={handleClickSpan}
          >
            {ellipsis ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        )}
        <a
          href={url}
          onClick={(e) => {
            e.stopPropagation();
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="flex p-1 items-center text-sm"
        >
          <LinkOutlined />
          <div className='ml-1'>link</div>
        </a>
      </div> */}
    </>
  );
}

const BodyTextDiv = styled.div`
  a {
    text-decoration: underline;
    color: #0071bc;
  }
  ul {
    list-style-type: disc;
    padding-left: 15px;
  }
  code {
    color: #ff006d;
  }
`;

export default BodyText;
