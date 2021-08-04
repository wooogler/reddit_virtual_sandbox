import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

function TaskGuide(): ReactElement {
  const { task } = useParams<{ task: string }>();
  return (
    <>
      <div className='category'>Community Rule</div>
      {task === 'example' ? (
        <div>
          Do not post questions "about stress in your working space" because
          they are asked too often.
        </div>
      ) : task.startsWith('A') ? (
        <div>
          Do not post questions asking “how to work as a software engineer
          without a CS relevant degree?” because they are asked too often and
          they are hard to answer questions.{' '}
        </div>
      ) : (
        <div>
          Add a [covid] flag to each and every post that is related to or
          mention covid.
        </div>
      )}
      <div className='category mt-6'>Your Task</div>
      {task === 'example' ? (
        <div>
          As a new moderator,{' '}
          <b>
            create an AutoMod configuration to detect any and every posts that
            violates above rule.
          </b>
        </div>
      ) : task.startsWith('A') ? (
        <div>
          As a new moderator,{' '}
          <b>
            create an AutoMod configuration to detect any and every posts that
            violates above rule.
          </b>
        </div>
      ) : (
        <div>
          As a new moderator,{' '}
          <b>
            create an AutoMod configuration to detect any and every posts that
            are related to or mention covid.
          </b>
        </div>
      )}
      <div className='category mt-6'>3 Example Posts</div>
      {task === 'example' ? (
        <div>The example posts will be given in the main tasks.</div>
      ) : task.startsWith('A') ? (
        <div>
          <div className='text-base font-semibold mt-2'>
            {'Is it still "a thing" for physics students to transition to CS?'}
          </div>
          <div className='text-sm'>
            {
              "Greetings from the brutal but beautiful world of physics where starry-eyed dreamers soon find out that 100s of people compete for one academic position and that the transition to industry is hard because for every one of you, there are 5 trained engineers with specific engineering degrees! \n\nIn all seriousness, I'm a bit worried about the job outlook I will have with a physics/econ BS and it's too late to now change my major. I'm an international student and as such my school limits me in how much time I can take. I'm thus thinking about how I might be able to get into CS as an alternative career option, despite having majored in physics. \n\nI know that physicists used to easily Segway into CS, but today, there are more than enough applicants who bring CS degrees to the table. Thus, I'm wondering how common / possible it is for a physics BS to go into a CS master's. \n\nHow possible is that? Any suggestion? (I'm currently minoring in CS but don't know if that's enough...)"
            }
          </div>
          <div className='text-base font-semibold mt-2'>
            {'What to self-learn to get a job?'}
          </div>
          <div className='text-sm'>
            {
              'I have just graduated with an engineering degree (not software) but I took a couple of programming courses (Intro to Programming and DS&Algos). I decided I wanted to go into software as a career rather than what I studied towards as I have a knack for it and enjoy it.\n\nI\u2019m currently doing this [Udemy course on Web Development](https://www.udemy.com/course/the-ultimate-fullstack-web-development-bootcamp/) which claims to be enough to land a job.\nI\u2019m hoping for some unbiased opinions, is this enough to get an entry level job? It has a couple of trivial projects too and I\u2019m willing to make one or two personal ones afterwards to boost my resume if needed.\n\n\nI hope to later learn more through my job or at least find more guidance as to what to learn by being in the industry, but I really just want to get my foot in the door. If that course is not enough, what else would you recommend? I really enjoy problem solving and the like so I\u2019m more than willing to learn more technical/theoretical stuff too that isn\u2019t a part of web dev.\n\nP.S. I\u2019m based in Canada if that changes anything'
            }
          </div>
          <div className='text-base font-semibold mt-2'>
            {'Found passion in CS in Senior Year'}
          </div>
          <div className='text-sm'>
            {
              "Current college senior with a trimester left to graduate. I took my first CS class in my senior year and have now completed the data structures class in addition to another applied coding class.\n\nI think CS is pretty fun and I'm rather certain that I'd like to be a SWE. I've started leetcoding and have now about \\~25 easy question and think they are a tad fun albeit struggle through it.\n\nWhat should I do to be a SWE? Do I go for a masters in CS? Should I try to delay my graduation by a trimester (i.e. grad by end of 2021), do a minor in CS? Will companies even bother with someone with no CS internships and little CS classes under the belt?"
            }
          </div>
        </div>
      ) : (
        <div>
          <div className='text-base font-semibold mt-2'>
            {'Are there programs somewhere between a boot camp and a degree?'}
          </div>
          <div className='text-sm'>
            {
              'I have the GI Bill but only about 20 or 24 months remaining. I stupidly failed a bunch of CC classes during COVID so college may not be my best option. I\u2019m not really in a hurry since I\u2019ll have a cost of living stipend so I don\u2019t really want a 3 month program but I\u2019d prefer to work sooner than 4 years from now. I don\u2019t do well in self-study without a solid foundation. Basing that off of how I learned musical instruments and human languages. Besides my awful CC experience, I\u2019ve always excelled academically and I have some experience with boot camp-type academic programs where I did very well. So I\u2019m looking for a program over the course of a year or two that, coupled with self-motivation, will help build a highly marketable skill set/portfolio. I greatly prefer in-person to online, a program for absolute beginners who can barely do excel formulas, and to start ASAP. Located in Los Angeles. Thank you.'
            }
          </div>
          <div className='text-base font-semibold mt-2'>
            {
              'I\u2019m not sure if I should leave my full time job for a 6 month internship! I\u2019m getting super overwhelmed by this scenario \ud83d\ude2d'
            }
          </div>
          <div className='text-sm'>
            {
              'I currently work for a very large global company that offers good benefits and a 50k annual salary, but I just got offered an internship with the Disney College Program which lasts about 6 months. I graduated a year ago in May 2020 and getting to for a famous entertainment/tech company seems like a dream come true. This internship pays me 1/3rd less than what I\u2019m being paid right now. Here are some thoughts I had about this scenario: \n\nIf I leave my current company and go for Disney, I\u2019m going for something... \n\n1. I have a chance for something that seems like a lifetime! It\u2019s like you rather go for something and say you did it rather than regretting later that you should have done it \ud83d\ude2d \n2. My dream company is Disney \n3. It might open opportunities for me because I work for Disney at a certain period \n4. And I\u2019m looking for a job now anyway trying to get out of my current job! \n5. It\u2019s 6 months and the job isn\u2019t secure \n\nIf I decline the offer from Disney,\n\n1. I don\u2019t like my job that I\u2019m currently at and I\u2019ll keep thinking about declining that offer I had from my dream company that I had a chance to! \n2. I have a full time job now vs 6 months at Disney.\n3. My associates I work with now are amazing which I can make new friends at Disney so I\u2019m not too worried about that. \n4. The pay is way more here than in Disney \n5. Can work and still make money while looking for a new job rather than a deadline if I were at Disney \n\nI am so excited about this opportunity but the thought of leaving my current full time job for \u201cjust a 6 month internship\u201d, which makes me so overwhelmed! \n\nI started this job last December 2020, and my internship begins in August 2021! I had an internship with Disney back in August 2020 but it got canceled due to COVID - 19.  I\u2019m afraid I\u2019m risking for something that isn\u2019t secure when I have something already secured. And I know my parents wouldn\u2019t be too happy with that as well. I want to ask for time off but 6 months seems like a lot of time. \n\nI\u2019m 23 and I live with my parents. I\u2019m saving a lot of money now but my current job requires a lot of relocation in the future for higher positions. The situation at home is getting unbearable which is why I\u2019m always out all the time until I have to come home.\n\nSo it really feels like I\u2019d be wasting this opportunity if I I don\u2019t take it. And this internship is a big change for me where I feel like I can\u2019t say no. But I feel like if I leave my full time position for something that\u2019s temporary - I would feel very uptight about it. \n\nI\u2019m afraid I may be making a huge mistake for my future and feel so indecisive as to the pathway I should take. If someone has some good advice, I would love to hear it and would greatly appreciate your input!'
            }
          </div>
          <div className='text-base font-semibold mt-2'>
            {
              "Not sure if this is the right sub, but I'm burnt out and looking for alternative careers which are technical but no so stressful and anxiety inducing"
            }
          </div>
          <div className='text-sm'>
            {
              "I've nearly 3 years of experience. Previously, I was working on NLP API creation for certain use cases, for almost 2 years. Due to a bad manager and certain inflexibilities in the company culture and family situation, I switched jobs just at the beginning of covid pandemic. Opportunities were slim so I picked the first decent offer at a tech company (FAANG level). However, the role here was sde. There are a lot of operational activities and I feel that I don't spend enough time coding. There's a lot of stress due to production issues and the team is in a bad state due to extended attrition. And I'm tired and drained out and exhausted. And I'm not sure I want to continue working in this profile. I like my co-workers but the work culture requires regular extended hours and I am barely able to make out an hour of time to just do things that I want to do (such as workout or read). Not counting the time for necessary things like meals.\nWhat I would like to know is suggestions for alternate technical career choices where my experience so far would be useful. I know I'm asking for too much.\n\nKindly don't invalidate my feelings as I'm in a low place at the moment."
            }
          </div>
        </div>
      )}
    </>
  );
}

export default TaskGuide;
