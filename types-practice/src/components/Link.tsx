import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { AUTH_TOKEN, take, skip, orderBy } from '../constants';
import { timeDifferenceForDate } from '../utils';
import { FEED_QUERY } from './LinkList';
import { pageData, Link } from '../types/feed'



const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;
interface linkProps {
  index: number;
  link: Link;
  children?: React.ReactNode;
}

const LinkComponent: React.FC<linkProps> = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    update(cache, { data: { vote } }) {

      const data = cache.readQuery<pageData>({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        }
      });

      const updatedLinks = data?.feed.links.map((feedLink: Link): Link => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        },
        variables: {
          take,
          skip,
          orderBy
        }
      });
    }
  });


  const content = authToken && (
    <div className="f6 lh-copy gray">
      {link.votes.length} votes | by{' '}
      {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
      {timeDifferenceForDate(link.createdAt!)}
    </div>
  )

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: 'pointer' }}
            onClick={(event: React.MouseEvent<HTMLElement>) => { vote() }}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {content}
      </div>
    </div >
  );
};

export default LinkComponent;
