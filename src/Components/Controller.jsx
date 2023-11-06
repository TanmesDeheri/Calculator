import { React, useReducer } from 'react'
import './style.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}
function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite)
                return { ...state, currentOperand: payload.digit, overwrite: false };
            if (payload.digit === '0' && state.currentOperand === '0')
                return state;
            if (payload.digit === "." && state.currentOperand.includes("."))
                return state
            return { ...state, currentOperand: `${state.currentOperand || ''}${payload.digit}` }
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null)
                return state
            if (state.currentOperand == null)
                return { ...state, operation: payload.operation }
            if (state.previousOperand == null)
                return { ...state, operation: payload.operation, previousOperand: state.currentOperand, currentOperand: null }
            return { ...state, previousOperand: evaluate(state), operation: payload.operation, currentOperand: null }
        case ACTIONS.CLEAR: return {}
        case ACTIONS.EVALUATE:
            if(state.currentOperand==null || 
                state.previousOperand==null || 
                state.operation==null)
            return state
            return{
                ...state,overwrite:true,previousOperand:null,operation:null,currentOperand:(evaluate(state))
            }
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite)
                return {
                    ...state, overwrite: false, currentOperand: null
                }
            else if (state.currentOperand == null) return state
            else if (state.currentOperand.length === 1)
                return { ...state, currentOperand: null }
            else
            return { ...state, currentOperand: state.currentOperand.slice(0, -1) }
        default:return state
    }

}
function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const curr = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(curr))
        return ""
    let result = ""
    switch (operation) {
        case '+': result = prev + curr
            break
        case '/': result = prev / curr
            break
        case '-': result = prev - curr
            break
        case '*': result = prev * curr
        break
        default:result="NA"
    }
    return result.toString()
}
const INTEGER_FORMATER=new Intl.NumberFormat('en-us',{maximumFractionDigits:0})
function formatOperand(operand){
    if(operand==null)
    return
const [integer,decimal]=operand.split('.')
if (decimal==null)
return INTEGER_FORMATER.format(integer)
return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}
export default function Controller() {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
    return (
        <div>
            <div className="calculator-grid">
                <div className="output">
                    <div className="previous-operand">
                        {formatOperand(previousOperand)} {operation}
                        <div className="current-operand">
                            {formatOperand(currentOperand)}
                        </div>
                    </div>
                </div>
                <button className="span-two" onClick={() => { dispatch({ type: ACTIONS.CLEAR }) }}>AC</button>
                <button onClick={()=>{dispatch({type:ACTIONS.DELETE_DIGIT})}} >DEL</button>
                <OperationButton operation='/' dispatch={dispatch}>/</OperationButton>
                <DigitButton digit='1' dispatch={dispatch}>1</DigitButton>
                <DigitButton digit='2' dispatch={dispatch}>2</DigitButton>
                <DigitButton digit='3' dispatch={dispatch}>3</DigitButton>
                <DigitButton digit='4' dispatch={dispatch}>4</DigitButton>
                <DigitButton digit='5' dispatch={dispatch}>5</DigitButton>
                <DigitButton digit='6' dispatch={dispatch}>6</DigitButton>
                <DigitButton digit='7' dispatch={dispatch}>7</DigitButton>
                <DigitButton digit='8' dispatch={dispatch}>8</DigitButton>
                <DigitButton digit='9' dispatch={dispatch}>9</DigitButton>
                <DigitButton digit='0' dispatch={dispatch}>0</DigitButton>
                <OperationButton operation='+' dispatch={dispatch}>+</OperationButton>
                <OperationButton operation='-' dispatch={dispatch}>-</OperationButton>
                <OperationButton operation='*' dispatch={dispatch}>*</OperationButton>
                <DigitButton digit='.' dispatch={dispatch}>.</DigitButton>
                <button className='span-two'onClick={()=>{dispatch({type:ACTIONS.EVALUATE})}}>=</button>
            </div>
        </div>
    )
}
