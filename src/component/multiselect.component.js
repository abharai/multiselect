import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import {Button,Overlay} from 'react-bootstrap';
import {ChoiceGroup , Checkbox} from 'office-ui-fabric-react';

class Multiselect extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.getTarget = this.getTarget.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    
        this.state = {
          show: false,
          selectedChoice: 'or',
          selectedAndChoice: {},
          checkboxArray : this.props.options,
          selectedValues:[]
        };
      }
    
      componentWillMount(){
          this.setState({selectedAndChoice: this.props.options[0]});
      }
      getTarget() {
        return ReactDOM.findDOMNode(this.target);
      }
    
      handleToggle() {
        this.setState({ show: !this.state.show });
      }

    onChoiceChange=(event)=>{
        if(!isEmpty(event)){
          const choice = (this.state.selectedChoice === 'or') ? 'and' : 'or';
          this.setState({selectedChoice : choice})
          map(this.state.checkboxArray,(value)=>{
              value.isChecked = false;
          });
          if(choice === 'and'){
            const arrvalue = [];
            arrvalue.push(this.state.selectedAndChoice.text);  
            this.setState({selectedValues: arrvalue});
          }else{
            this.setState({selectedValues: []}); 
          }
        }
      }

    onCheckboxChange=(event)=>{
        console.log(event);
        const selectedArr = this.state.selectedValues;
        if(this.state.selectedChoice === 'or'){
            map(this.state.checkboxArray,(value)=>{
                if(event.currentTarget.innerText.trimRight() === value.text){
                    const index = selectedArr.indexOf(value.text); 
                    if(index ===  -1){
                        value.isChecked = true;
                        selectedArr.push(value.text)
                    }else{
                        value.isChecked = false;
                        selectedArr.splice(index, 1); 
                    }
                    this.setState({selectedValues : selectedArr});
                }
            });
        }
        else{
            map(this.state.checkboxArray,(value)=>{
                const index = selectedArr.indexOf(value.text);
                if(event.currentTarget.innerText.trimRight() === value.text){  
                    value.isChecked = true;
                    selectedArr.push(value.text)
                    this.setState({selectedValues : selectedArr});
                }else{
                    if(index > -1){
                        selectedArr.splice(index, 1);
                    }
                    this.setState({selectedValues : selectedArr});
                }
            });
        }
      }

    getGroup = ()=>{
        let content = null;
       content=( <ChoiceGroup
          defaultSelectedKey={this.state.selectedChoice}
          options={ [
            {
              key: 'or',
              text: 'OR',
            },
            {
              key: 'and',
              text: 'AND',
            }    
            ]
        }
        onChange={ (event)=>{this.onChoiceChange(event)}}
        required={ true }
        />
    )
    return content;
    }
    
    getCheckbox=(options)=>{
        const contentArray = [];
        if(this.state.selectedChoice === 'or'){
            map(options,(option)=>{
                contentArray.push(<div><Checkbox
                    label={option.text}
                    onChange={ (event)=>{this.onCheckboxChange(event)} }
                /></div>);
            });
        }else{
            contentArray.push(<ChoiceGroup
                defaultSelectedKey={this.state.selectedAndChoice.key}
                options={this.state.checkboxArray}
                onChange={ (event)=>{this.onCheckboxChange(event)}}
              />
          );
        }
        return contentArray;
    }

    showCurrentValues = () =>{
        let currValues = '';
        if(isEmpty(this.state.selectedValues)){
            currValues = 'Tags';
        }
        else if(this.state.selectedValues.length === 1){
            currValues = this.state.selectedValues[0];
        }else{
            currValues = this.state.selectedValues[0] + ` + ${this.state.selectedValues.length - 1} more`;
        }
        return currValues;
    }

    render() {
        const {className} = this.props;
        const sharedProps = {
          container: this,
          target: this.getTarget,
          show: this.state.show
        };
    
        return (
          <div className={'dropdown-overlay'}>
            <Button
              ref={button => {
                this.target = button;
              }}
              onClick={this.handleToggle}
              className={'toggle-button'}
            >
              {this.showCurrentValues()}
            </Button>
    
            <Overlay {...sharedProps} placement="bottom">
              <div className={className}>
                <div className={'custom-check-group'}>{this.getGroup()}</div>
                <div className={'custom-check-box'}>{this.getCheckbox(this.state.checkboxArray)}</div>
              </div>
            </Overlay>
          </div>
        );
      }
}

Multiselect.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    className: PropTypes.string
}

Multiselect.defaultProps = {
    options : [],
    className: 'multiselect-dropdown'
}

export default Multiselect;
