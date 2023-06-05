import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface CounterState {
    value: number
}

// Define the initial state using that type
const initialState: CounterState = {
    value: 0
}

export const exempleSlice = createSlice({
    name: 'exemple34',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        decrement: state => {
            state.value -= 1
        },
    }
})
export default exempleSlice.reducer
