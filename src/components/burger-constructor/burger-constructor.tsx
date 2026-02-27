import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { useDispatch } from '../../services/store';
import { postOrderThunk } from '../../services/order/actions';
import {
  clearOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/order/slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/user/slice';
import { selectConstructorItems } from '../../services/burger-constructor/slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const user = useSelector(selectUser);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const bunId = constructorItems.bun._id;
    const ingredientsId = [
      bunId,
      ...constructorItems.ingredients.map((i) => i._id),
      bunId
    ];
    dispatch(postOrderThunk(ingredientsId));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems.bun, constructorItems.ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
