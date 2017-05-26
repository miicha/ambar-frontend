import React, { Component } from 'react'

import AutosizeInput from 'react-input-autosize'
import Autosuggest from 'react-autosuggest'

import classes from './TagsInput.scss'

const Tag = ({children, onRemove}) => {
    const onRemoveCallback = onRemove 
        ? onRemove
        : () => {}

    return (
        <span 
            style={{padding: '4px', cursor: 'pointer', display: 'inline-block', 'word-wrap': 'break-word', 'word-break': 'break-all'}}
            onClick={() => console.log('clicked')}>
            {children}
            <span 
                onClick={() => onRemoveCallback(children)}
                style={{color: 'red', cursor: 'pointer', padding: '3px'}}
            >x</span>
        </span>
    )
}

Tag.propTypes = {    
    children: React.PropTypes.string.isRequired,
    onRemove: React.PropTypes.func
}

const languages = ['csharp', 'basic', 'pascal', 'delphi', 'ada']

class TagsInput extends Component {
    constructor() {
        super()

        this.state = {
            tags: ['test1', 'test2'],
            inputValue: '',
            suggestions: []
        }
    }

    addTag(tag) {
        if (!tag) {
            return
        }

        if (this.state.tags.indexOf(tag) == -1) {
            const tags = [...this.state.tags, tag]
            this.setState({...this.state, tags: tags, inputValue: ''})  
        } else {
            this.setState({...this.state, inputValue: ''})     
        }  
    }

    removeTag(tag) {
        const currentTags = this.state.tags

        if (!currentTags || currentTags.length === 0) {
            return
        }
        
        this.setState({...this.state, tags: currentTags.filter(t => t !== tag)})
    }

    removeLastTag() {
        const currentTags = this.state.tags
        if (!currentTags || currentTags.length === 0) {
            return
        }
        
        this.setState({...this.state, tags: currentTags.slice(0, currentTags.length - 1)})
    }

    onChange(value) {        
        this.setState({...this.state, inputValue: value })

        const newTags = value.split(',').map(t => t.trim().toLowerCase())
        
        if (newTags.length > 1 && newTags[0] != '')  {
            this.addTag(newTags[0])            
        }        
    }

    onKeyPress(event) {        
        if (event.charCode === 13) { // onEnter
            this.addTag(this.state.inputValue)
            return
        }        
    }

    onKeyDown(event) {        
       if (event.keyCode === 8) { // onBackspace            
            if (!this.state.inputValue) {
                this.removeLastTag()
                return
            }
        }
    }

    onBlur() {
        this.addTag(this.state.inputValue)
    }

    focusOnInput() {
        console.log(this.refs.suggestInput)
        if (!this.refs.suggestInput) {
            return
        }

        this.refs.suggestInput.input.focus()
    }
    
    autosizeInput(inputProps) {
        return (
            <AutosizeInput                            
                minWidth={40}                               
                inputStyle={{
                    'border':'none',
                    'background-image':'none',
                    'background-color':'transparent',
                    '-webkit-box-shadow': 'none',
                    '-moz-box-shadow': 'none',
                    'box-shadow': 'none',
                    'outline': 'none'
                }}
                type='text'     
                placeholder='Start typing to add tags'             
                {...inputProps}        
            /> 
        )
    }

    getSuggestions(value) {
        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length

        return inputLength === 0 ? [] : languages.filter(lang =>
            lang.toLowerCase().slice(0, inputLength) === inputValue
        )
    }

    onSuggestionsFetchRequested({ value }) {
        this.setState({
            suggestions: this.getSuggestions(value)
        })
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    }

    render() {
        const props = this.props

        const theme = {
             
  container: {
      display: 'inline-block',
    position: 'relative'
  },
  /*
  input: {
    width: 240,
    height: 30,
    padding: '10px 20px',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    border: '1px solid #aaa',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  inputFocused: {
    outline: 'none'
  },
  */
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 30,
    width: 280,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
}


        return (     
            <div 
                style={{padding: '5px', cursor: 'text'}}
                onClick={() => this.focusOnInput()}>   
                {this.state.tags.map((tag, idx) => 
                    <Tag key={idx} onRemove={(tag) => this.removeTag(tag)}>{tag}</Tag>)
                }       
                <Autosuggest 
                    ref='suggestInput'
                    suggestions={this.state.suggestions}                    
                    getSuggestionValue={s => s}
                    renderSuggestion={(suggestion) => <span>{suggestion}</span>}
                    onSuggestionSelected={(e, {suggestion}) => {
                        this.addTag(suggestion)
                    }}                           
                    onSuggestionsFetchRequested={e => this.onSuggestionsFetchRequested(e)}
                    onSuggestionsClearRequested={e => this.onSuggestionsClearRequested(e)}            
                    inputProps = {{
                        value: this.state.inputValue,
                        onChange: (e) => this.onChange(e.target.value),                       
                        onBlur: () => this.onBlur(),
                        onKeyPress: (event) => this.onKeyPress(event),
                        onKeyDown: (event) => this.onKeyDown(event),
                        /*ref: (ref) => {console.log('here'); this.inputRef = ref}*/
                    }}
                    theme={theme}
                    renderInputComponent={(inputProps) => this.autosizeInput(inputProps)}                    
                />                                                       
            </div>
        )
    }
}

TagsInput.propTypes = {    
}

export default TagsInput




