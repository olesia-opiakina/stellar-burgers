import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrdersThunk } from '../../services/profile-orders/actions';
import {
  selectProfileError,
  selectProfileIsLoading,
  selectProfileOrders
} from '../../services/profile-orders/slice';
import { Preloader } from '../../components/ui/preloader';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileIsLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    if (!orders.length) dispatch(getUserOrdersThunk());
  }, []);

  if (isLoading) return <Preloader />;

  if (error) return <div>{error}</div>;

  return <ProfileOrdersUI orders={orders} />;
};
