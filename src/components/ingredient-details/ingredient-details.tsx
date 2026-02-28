import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/ingredients/slice';

export const IngredientDetails: FC = () => {
  const items = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);

  const { id } = useParams<{ id: string }>();
  const ingredientData = items.find((item) => item._id === id);

  if (isLoading) {
    return <Preloader />;
  }
  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
