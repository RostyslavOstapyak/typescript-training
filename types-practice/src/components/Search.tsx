import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import LinkComponent from './Link';
import { Link } from '../types/feed';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
        createdAt
      }
    }
  }
`;

const Search: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [executeSearch, { data }] = useLazyQuery(
    FEED_SEARCH_QUERY
  );
  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter }
            })
          }
        >
          OK
        </button>
      </div>
      {data &&
        data.feed.links.map((link: Link, index: number): React.ReactFragment => (
          <LinkComponent key={link.id} link={link} index={index} />
        ))}
    </>
  );
};

export default Search;
