import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsThunk } from '../../services/feed/actions';
import {
  selectFeedError,
  selectFeedIsLoading,
  selectFeedOrders
} from '../../services/feed/slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedIsLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, []);

  const handleGetFeeds = () => {
    dispatch(getFeedsThunk());
  };

  if (isLoading) {
    return <Preloader />;
  }
  if (error) return <div>{error}</div>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
