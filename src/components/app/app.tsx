import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredientsThunk } from '../../services/ingredients/actions';
import { checkUserAuth } from '../../services/user/actions';
import { Protected } from '../protected-route';
import {
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/ingredients/slice';
import { useMatch } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const feedMatch = useMatch('/feed/:number');
  const profileMatch = useMatch('/profile/orders/:number');
  const orderNumber = feedMatch?.params.number || profileMatch?.params.number;
  const orderTitle = orderNumber ? `#${orderNumber}` : '';

  const closeModal = () => navigate(-1);

  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(checkUserAuth());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={<Protected onlyUnAuth component={<Login />} />}
          />
          <Route
            path='/register'
            element={<Protected onlyUnAuth component={<Register />} />}
          />
          <Route
            path='/forgot-password'
            element={<Protected onlyUnAuth component={<ForgotPassword />} />}
          />
          <Route
            path='/reset-password'
            element={<Protected onlyUnAuth component={<ResetPassword />} />}
          />
          <Route
            path='/profile'
            element={<Protected component={<Profile />} />}
          />
          <Route
            path='/profile/orders'
            element={<Protected component={<ProfileOrders />} />}
          />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route
            path='/profile/orders/:number'
            element={
              <Protected
                component={
                  <div className='mt-10'>
                    <p
                      className='text text_type_digits-default mb-5'
                      style={{ textAlign: 'center' }}
                    >
                      {orderTitle}
                    </p>
                    <OrderInfo />
                  </div>
                }
              />
            }
          />
          <Route
            path='/feed/:number'
            element={
              <div>
                <p
                  className='text text_type_digits-default mb-5'
                  style={{ textAlign: 'center' }}
                >
                  {orderTitle}
                </p>
                <OrderInfo />
              </div>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={closeModal} title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={closeModal} title={orderTitle}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Protected
                component={
                  <Modal onClose={closeModal} title={orderTitle}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
