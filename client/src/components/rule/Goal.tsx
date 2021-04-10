import React, { ReactElement } from 'react';

interface Props {}

function Goal({}: Props): ReactElement {
  return (
    <div>
      <div className="text-base">
        You will be required to create a new keyword filter that only catches
        the comments that violate a given rule.
      </div>
      <div className="text-lg my-2">Rule 4: Avoid politics</div>
      <div>
        <b>
          Off topic political, policy, and economic posts and comments will be
          removed.
        </b>{' '}
        We ask that these discussions pertain primarily to the current
        Coronavirus pandemic. These off topic discussions can easily come to
        dominate online discussions. Therefore we remove these unrelated posts
        and comments and lock comments on borderline posts. Politics includes
        but isn’t limited to
        <ul className="ml-4 my-2">
          <li className="list-disc">
            shaming campaigns against businesses and individuals.{' '}
          </li>
          <li className="list-disc">
            posts about a politician’s take on events will be removed unless
            they are actively discussing policy or legislation.
          </li>
          <li className="list-disc">opinion pieces may be removed. </li>
        </ul>
        <div>
          Posts about what has happened are preferred to posts about what should
          happen. Some leniency with respect to 'should'-type posts may be given
          for executive and legislative leadership and provincial or state
          authorities with large active outbreaks.
        </div>
        <div>
          Comments are the most appropriate place for your advocacy of
          particular approaches, but are not for debating and insulting people
          of a different ideological persuasion.
        </div>
      </div>
    </div>
  );
}

export default Goal;
