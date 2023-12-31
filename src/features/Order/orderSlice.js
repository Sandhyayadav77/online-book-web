import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder } from './orderAPI';

const initialState = {
  orders: [],
  status: 'idle',
  currentOrder : null
};


export const createOrderAsync = createAsyncThunk(
  'order/createOrder',
  async (order) => {
    // console.log(order)
    const response = await createOrder(order);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,

  reducers: {
  resetOrder: (state)=>{
    state.currentOrder= null;
  }
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders.push(action.payload);
        state.currentOrder= action.payload
        // console.log('Updated currentOrder:', state.currentOrder , action);
         // Log the updated currentOrder
      });
  },
});
export const { resetOrder } = orderSlice.actions;


export const selectOrders = (state) => state.order.orders;
export const selectCurrentOrder = (state) => state.order.currentOrder;

export default orderSlice.reducer;
