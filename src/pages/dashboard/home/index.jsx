// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { decrement, increment, incrementByAmount } from '../../../redux/slice/counterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Home = () => {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    console.log('asdasd', process.env.REACT_APP_ENV)

    useEffect(()=>{
    },[])
  return (
    <div>
      <h1>czxczxczxczxczxczxczxczxc</h1>
    <h1>Count: {count}</h1>
    <button onClick={() => dispatch(increment())}>Increment</button>
    <button onClick={() => dispatch(decrement())}>Decrement</button>
    <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
  </div>
  );
};

export default Home;
