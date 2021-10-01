import { useState } from 'react'
import { useQuery } from 'react-query'
//Components
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import { LinearProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
//Styles
import { Wrapper, StyledButton } from './App.styles';
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
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts);
  //console.log(data);

  const getTotalItens = (items: CartItemType[]) =>
    items.reduce((ack: number, items) => ack + items.stock, 0);


  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      //1. Is the item alredy added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id 
          ? {...item, stock: item.stock + 1 }
          :item
        );
      }
    //First time the item is added
    return[ ...prev, { ...clickedItem, stock: 1}];

    });
  };
  const handleRemoveFromCart = (id:number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if(item.id === id){
          if(item.stock === 1) return ack;
          return [...ack, { ...item, stock: item.stock -1}];
        }else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went Worng...</div>;

  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>

      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItens(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>

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