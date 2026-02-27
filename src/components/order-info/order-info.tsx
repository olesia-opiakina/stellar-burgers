import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getFeedsThunk } from '../../services/feed/actions';
import { selectIngredients } from '../../services/ingredients/slice';
import {
  selectFeedIsLoading,
  selectFeedOrders
} from '../../services/feed/slice';
import {
  selectProfileIsLoading,
  selectProfileOrders
} from '../../services/profile-orders/slice';
import { getUserOrdersThunk } from '../../services/profile-orders/actions';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isProfileLoading = useSelector(selectProfileIsLoading);
  const isFeedLoading = useSelector(selectFeedIsLoading);

  const { number } = useParams();
  const param = number ?? '';
  const orderNumber = Number(param);

  const feedOrders = useSelector(selectFeedOrders);
  const feedOrder = feedOrders.find(
    (order) => order.number === orderNumber || order._id === param
  );

  const profileOrders = useSelector(selectProfileOrders);
  const profileOrder = profileOrders.find(
    (order) => order.number === orderNumber || order._id === param
  );

  const orderData = profileOrder ?? feedOrder;

  useEffect(() => {
    if (!orderData && !feedOrders.length) {
      dispatch(getFeedsThunk());
    }
    if (!orderData && !profileOrders.length) {
      dispatch(getUserOrdersThunk());
    }
  }, []);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || isProfileLoading || isFeedLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
