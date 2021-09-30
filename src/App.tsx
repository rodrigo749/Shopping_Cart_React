import { useState } from 'react'
import { useQuery } from 'react-query'
//Components
import Item from './Item/Item'
import Drawer from '@material-ui/core';
import { LinearProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import Badge from '@material-ui/core';
//Styles
import { Wrapper } from './App.styles';
//Types
export type CartItemType = {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
}


const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://5d6da1df777f670014036125.mockapi.io/api/v1/product')).json();

const App = () => {
  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts);
  console.log(data);

  const getTotalItens = () => null;

  const handleAddToCart = (clickedItem: CartItemType) => null;

  const handleRemoveFromCart = () => null;

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went Worng...</div>;

  return (
    <Wrapper>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;